const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Data = require("./data.js");
const cookieParser = require("cookie-parser");
const { UserRouter } = require("./routes/routes.js");

const app = express();
dotenv.config();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "https://s60-vinay-blogie.onrender.com", "https://blogie-1.netlify.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", UserRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("I am alive bro!!");
});

app.post('/data', async (req, res) => {
  try {
    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.status(201).json({ status: true, data: savedData });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});
app.get('/data', async (req, res) => {
  try {
    const allData = await Data.find(); // Fetch all documents from the Data collection
    res.status(200).json(allData); // Send the data back as a JSON response
  } catch (error) {
    res.status(500).json({ status: false, error: error.message }); // Handle errors
  }
});

// Start the server and connect to MongoDB
app.listen(process.env.PORT || 3001, async () => {
  try {
    await mongoose.connect("mongodb+srv://vinnugollakoti:vinnu1244@cluster0.cwivpr4.mongodb.net/medsecure");
    console.log("Connected to MongoDB");
    console.log("Server is running");
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
