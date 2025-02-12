require('dotenv').config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY; 

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = decoded; // Attach decoded user data to the request
        next();
    });
};

module.exports = authenticateJWT;
