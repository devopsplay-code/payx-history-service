import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { tls: true })
  .then(() => console.log(`${process.env.SERVICE_NAME} connected to MongoDB`))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 4004;
const SERVICE = process.env.SERVICE_NAME || "history-service";

// Sample schema for transaction history
const transactionSchema = new mongoose.Schema({
  name: String,
  date: Date,
  amount: Number,
  status: String,
}, { collection: "history" });

const Transaction = mongoose.model("Transaction", transactionSchema);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: SERVICE, version: "0.1.0" });
});

// Get all transaction history
app.get("/history", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`${SERVICE} running on port ${PORT}`);
});
