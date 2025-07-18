import mongoose from "mongoose";

const HealthEntrySchema = new mongoose.Schema({
  email: { type: String, required: true },
  steps: Number,
  sleep: Number,
  water: Number,
  exercise: Number,
  mood: String,
  reflection: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("HealthEntry", HealthEntrySchema);
