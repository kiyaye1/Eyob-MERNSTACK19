import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SaveUserToDBUsingAxios, fetchUserHobbiesFromDB, addHobbyToDB, } from "../../State/User/UserActions";
import { resetStaticNotificationsOnLogin, addStaticNotificationsOnLogin, } from "../../State/Notification/NotificationActions";
import ATMDispenser from "./ATMDispencer";
import axiosInstance from "../../axiosConfig";

const UserHooksComponentRef = () => {
    // Access Redux state and dispatcher
    const user = useSelector((store) => store.userReducer.user);
    const userHobbies = useSelector((store) => store.userReducer.user.hobbies || []);
    const { notifications } = useSelector((state) => state.notificationReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Local state to toggle between Sign In and Sign Up
    const [isSignUp, setIsSignUp] = useState(false);

    // Refs for Sign In form
    const signInEmailRef = useRef(null);
    const signInPasswordRef = useRef(null);

    // Refs for Sign Up form
    const signUpNameRef = useRef(null);
    const signUpEmailRef = useRef(null);
    const signUpPasswordRef = useRef(null);
    const signUpStreetRef = useRef(null);
    const signUpMobileRef = useRef(null);

    // State for hobbies
    const [hobby, setHobby] = useState("");
    const [selectedHobby, setSelectedHobby] = useState("");

    // If user changes or logs out, clear form fields (optional)
    useEffect(() => {
        if (!user) {
        clearForm();
        }
    }, [user]);

    // Fetch hobbies and notifications when user logs in
    useEffect(() => {
        if (user?.email) {
        dispatch(fetchUserHobbiesFromDB(user.email));
        if (notifications.length === 0) {
            dispatch(resetStaticNotificationsOnLogin());
            dispatch(addStaticNotificationsOnLogin());
        }
        }
    }, [dispatch, user?.email, notifications]);

    // Clear all form fields
    const clearForm = () => {
        if (signInEmailRef.current) signInEmailRef.current.value = "";
        if (signInPasswordRef.current) signInPasswordRef.current.value = "";

        if (signUpNameRef.current) signUpNameRef.current.value = "";
        if (signUpEmailRef.current) signUpEmailRef.current.value = "";
        if (signUpPasswordRef.current) signUpPasswordRef.current.value = "";
        if (signUpStreetRef.current) signUpStreetRef.current.value = "";
        if (signUpMobileRef.current) signUpMobileRef.current.value = "";
    };

    // Handle Sign In
    const handleSignIn = async (evt) => {
        evt.preventDefault();

        const email = signInEmailRef.current?.value.trim() || "";
        const password = signInPasswordRef.current?.value.trim() || "";

        if (!email || !password) {
        alert("email and password are required for Sign In!");
        return;
        }

        const userObj = { email, password };
        try {
            const { data } = await axiosInstance.post(`/user/signinup`, userObj);
            localStorage.setItem("token", data.token);
            await dispatch(SaveUserToDBUsingAxios(userObj));
            console.log("Sign In dispatched, waiting for Redux state update...");
            navigate("/product");
        } catch (error) {
            console.error("Authentication failed:", error);
            alert("Invalid credentials or user already exists.");
        }
    };

    // Handle Sign Up
    const handleSignUp = async (evt) => {
        evt.preventDefault();

        const name = signUpNameRef.current?.value.trim() || "";
        const email = signUpEmailRef.current?.value.trim() || "";
        const password = signUpPasswordRef.current?.value.trim() || "";
        const street = signUpStreetRef.current?.value.trim() || "";
        const mobile = signUpMobileRef.current?.value.trim() || "";

        if (!email || !password) {
        alert("Email and password are required for Sign Up!");
        return;
        }

        const userObj = { name, email, password, street, mobile };
        try {
            const { data } = await axiosInstance.post(`/user/signinup`, userObj);
            localStorage.setItem("token", data.token);
            await dispatch(SaveUserToDBUsingAxios(userObj));
            console.log("Sign In dispatched, waiting for Redux state update...");
            navigate("/product");
        } catch (error) {
            console.error("Authentication failed:", error);
            alert("Invalid credentials or user already exists.");
        }

    };

    // Auto-redirect when Redux updates the user state
    useEffect(() => {
        if (user?.email) {
        console.log("User detected, navigating to /product...");
        navigate("/product");
        }
    }, [user, navigate]);

    // Add a new hobby
    const addNewHobby = () => {
        if (hobby.trim()) {
        dispatch(addHobbyToDB(user?.email, hobby));
        setHobby("");
        } else {
        alert("Please enter a hobby.");
        }
    };

    // User logged in - show Hobbies
    if (user?.email) {
        return (
        <div style={{ padding: "0 20px" }}>
            <section>
            <div>
                <ATMDispenser />
            </div>
            <h2>Hobby Management</h2>
            <div>
                <div>
                <b>Add a Hobby</b>
                <input
                    type="text"
                    placeholder="Enter a hobby"
                    value={hobby}
                    onChange={(e) => setHobby(e.target.value)}
                />
                <button onClick={addNewHobby}>Add Hobby</button>
                </div>
                <div>
                <b>Your Hobbies</b>
                <select
                    value={selectedHobby}
                    onChange={(e) => setSelectedHobby(e.target.value)}
                >
                    <option value="" disabled>
                    Select a hobby
                    </option>
                    {userHobbies.map((h, index) => (
                    <option key={index} value={h}>
                        {h}
                    </option>
                    ))}
                </select>
                </div>
            </div>
            </section>
        </div>
        );
    }

    // User NOT logged in - show Sign In or Sign Up 
    return (
        <div style={{ padding: "0 20px" }}>
        {!isSignUp ? (
            // Sign In 
            <section className="componentClass">
            <h1>Sign In</h1>
            <div className="form col-md-6">
                <div className="col-md-12">
                <b>Email</b>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    ref={signInEmailRef}
                    maxLength={40}
                />
                </div>
                <div className="col-md-12">
                <b>Password</b>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    ref={signInPasswordRef}
                    maxLength={20}
                />
                </div>
                <div className="col-md-12">
                <input
                    type="button"
                    className="btn btn-primary col-md-4"
                    value="Sign In"
                    onClick={handleSignIn}
                />
                </div>
                <div className="col-md-12" style={{ marginTop: 10 }}>
                <small>
                    Don't have an account?{" "}
                    <button
                    type="button"
                    onClick={() => {
                        clearForm();
                        setIsSignUp(true);
                    }}
                    style={{ border: "none", background: "none", color: "blue", cursor: "pointer" }}
                    >
                    Sign Up
                    </button>
                </small>
                </div>
            </div>
            </section>
        ) : (
            // Sign Up
            <section className="componentClass">
            <h1>Sign Up</h1>
            <div className="form col-md-6">
                <div className="col-md-12">
                <b>Name</b>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    ref={signUpNameRef}
                    maxLength={40}
                />
                </div>
                <div className="col-md-12">
                <b>Email</b>
                <input
                    type="text"
                    className="form-control"
                    placeholder="example@example.com"
                    ref={signUpEmailRef}
                    maxLength={40}
                />
                </div>
                <div className="col-md-12">
                <b>Password</b>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    ref={signUpPasswordRef}
                    maxLength={20}
                />
                </div>
                <div className="col-md-12">
                <b>Street</b>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Street Name"
                    ref={signUpStreetRef}
                />
                </div>
                <div className="col-md-12">
                <b>Mobile</b>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Mobile"
                    ref={signUpMobileRef}
                />
                </div>
                <div className="col-md-12">
                <input
                    type="button"
                    className="btn btn-success col-md-4"
                    value="Sign Up"
                    onClick={handleSignUp}
                />
                </div>
                <div className="col-md-12" style={{ marginTop: 10 }}>
                <small>
                    Already have an account?{" "}
                    <button
                    type="button"
                    onClick={() => {
                        clearForm();
                        setIsSignUp(false);
                    }}
                    style={{ border: "none", background: "none", color: "blue", cursor: "pointer" }}
                    >
                    Sign In
                    </button>
                </small>
                </div>
            </div>
            </section>
        )}
        </div>
    );
};

export default UserHooksComponentRef;