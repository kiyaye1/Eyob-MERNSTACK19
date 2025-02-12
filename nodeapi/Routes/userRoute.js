const express = require("express");
require('dotenv').config();
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const userDataModel = require("../DataModel/UserDataModel");

const SECRET_KEY = process.env.SECRET_KEY;

userRouter.post("/signinup", async (req, res) => {
    // Now also extract 'email' if you are collecting it from the frontend
    const { name, email, password, street, mobile } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await userDataModel.findOne({ email });

        if (existingUser) {
            console.log("User exists:", existingUser);

            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" }); // Unauthorized
            }

            // Generate JWT for the existing user
            const token = jwt.sign(
                { id: existingUser._id, email: existingUser.email },
                SECRET_KEY,
                { expiresIn: "1h" } // Token valid for 1 hour
            );

            return res.status(200).json({ user: existingUser, token }); // Successful login
        }

        // If user does not exist, proceed with sign-up
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        // Provide the 'email' field here if your schema expects it:
        const newUser = new userDataModel({
            name,
            email, 
            password: hashedPassword,
            street,
            mobile,
        });

        const savedUser = await newUser.save();
        console.log("Successful signup:", savedUser);

        // Generate JWT for the new user
        const token = jwt.sign(
            { id: savedUser._id, email: savedUser.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(201).json({ user: savedUser, token }); 
    } catch (error) {
        console.error("Error during sign-in or sign-up:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get All Users
userRouter.get("/users", (req, res) => {
    userDataModel
        .find()
        .then((users) => res.json(users))
        .catch((err) => {
            console.error("Error while fetching users:", err);
            res.status(500).send("Error while fetching users");
        });
});

// Get User by UserName
userRouter.post("/getUser", (req, res) => {
    const { email } = req.body;

    userDataModel
        .findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                console.log(`User ${email} not found`);
                return res.status(404).json({ message: "User not found" });
            }
            res.json(foundUser);
        })
        .catch((err) => {
            console.error("Error while fetching user:", err);
            res.status(500).send("Error while fetching user");
        });
});

userRouter.get("/hobbies", async (req, res) => {
    const email = req.query.email; 

    try {
        const user = await userDataModel.findOne({ email }); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.hobbies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hobbies", error });
    }
});

userRouter.post("/addHobby", async (req, res) => {
    const { hobby, email } = req.body; 

    try {
        const user = await userDataModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.hobbies.push(hobby);
        await user.save();
        res.status(200).json(hobby);
    } catch (error) {
        res.status(500).json({ message: "Error saving hobby", error });
    }
});

module.exports = userRouter;