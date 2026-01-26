import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  note: String,
  amount: { type: String, required: true },
  txHash: { type: String, required: true },
  from: String,
  to: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Donation", donationSchema);
