import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  medication: { type: String, required: true },
  instructions: { type: String, default: "" },
  refillCount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Prescription", PrescriptionSchema);
