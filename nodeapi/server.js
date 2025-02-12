const express = require("express");
const cors = require("cors");
require('dotenv').config();
const authenticateJWT = require("./middleware/authMiddleware");
const defaultRoutes = require("./Routes/defaultRoute");
const userRoutes = require("./Routes/userRoute");
const studentRoutes = require("./Routes/studentRoute");
const productRoutes = require("./Routes/productRoute");
const cartRoutes = require("./Routes/cartRoute");
const recentOrderRoutes = require("./Routes/recentOrderRoute");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb", extended: false }));
app.use("/static", express.static("public")); // Serve static files

// Apply JWT authentication middleware to protected routes
app.use("/cart", authenticateJWT, cartRoutes);
app.use("/recent-orders", authenticateJWT, recentOrderRoutes);
app.use("/product", authenticateJWT, productRoutes);

// Public routes
app.use("/user", userRoutes);
app.use("/student", studentRoutes);
app.use("/", defaultRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
