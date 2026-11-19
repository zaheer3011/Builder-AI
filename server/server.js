const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { default: authRouter } = require("./routes/authRouter");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ORIGIN.split(","), credentials: true }));
app.use(cookieParser);
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server is Live");
});
app.use("/api/auth", authRouter);

// Centralized error Handler
app.use((err, _req, res, _next) => {
  console.error(`[Error] ${err.message}`);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT No : ${PORT}`);
});
