const express = require("express");
const db = require("./database");

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 3000;

app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Blog API is running"
    });
});


// API routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// Global error handler
app.use(errorHandler);


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});