const express = require("express");
const cors = require("cors");

const defaultRoutes = require("./Routes/defaultRoute");
const userRoutes = require("./Routes/userRoute");
const studentRoutes = require("./Routes/studentRoute");
const productRoutes = require("./Routes/productRoute");
const cartRoutes = require("./Routes/cartRoute");

const app = express();
const PORT = 9000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb", extended: false }));
app.use("/static", express.static("public")); // Serve static files

// Mounting Routes
app.use("/user", userRoutes); // User-related routes
app.use("/student", studentRoutes); // Student-related routes
app.use("/product", productRoutes); // Product-related routes
app.use("/cart", cartRoutes); // Cart-related routes
app.use("/", defaultRoutes); // Default routes

// Handle 404 for undefined routes
app.get("*", (req, res) => {
  res.status(404).send("API is not ready yet");
});

// Start the server
console.log(`API is listening at port ${PORT}`);
app.listen(PORT);
