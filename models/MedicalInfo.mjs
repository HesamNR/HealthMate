import mongoose from "mongoose";

const MedicalInfoSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true, lowercase: true },
  name:       { type: String, default: "" },
  phone:      { type: String, default: "" },
  address:    { type: String, default: "" },
  allergies:  { type: String, default: "" },
  conditions: { type: String, default: "" },
  implants:   { type: String, default: "" },
  notes:      { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("MedicalInfo", MedicalInfoSchema);