const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const predictRoute = require("./routes/predict");
const localitiesRoute = require("./routes/localities");

const app = express();

// ✅ Render provides PORT via environment variable
const PORT = process.env.PORT || 5000;

/**
 * 🔐 CORS Configuration
 * - Allows requests from Vercel frontend
 * - "*" is acceptable for college/demo projects
 */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", predictRoute);
app.use("/api", localitiesRoute);

// Health check (Render uses this)
app.get("/", (req, res) => {
  res.send("✅ Real Estate Prediction API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
