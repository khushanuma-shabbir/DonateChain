import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Donation from "./models/Donation.js"; 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URI = "mongodb://127.0.0.1:27017/donationDB";
const PORT = 3000;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Donation Server is running ✅");
});

// ✅ Donation Notify Route
app.post("/notify", async (req, res) => {
  try {
    const { name, phone, note, amount, txHash, from, to } = req.body;

    // Basic validation
    if (!name || !amount || !txHash) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save donation to MongoDB
    const donation = new Donation({ name, phone, note, amount, txHash, from, to });
    await donation.save();

    console.log("✅ Donation saved successfully!");

    res.json({ success: true, message: "Donation saved successfully!" });

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
