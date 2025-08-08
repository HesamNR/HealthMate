import mongoose from "mongoose";

const EmergencyContactSchema = new mongoose.Schema({
  email:       { type: String, required: true, lowercase: true },
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  address:     { type: String, required: true },
  relationship:{ type: String, required: true },
}, { timestamps: true });

export default mongoose.model("EmergencyContact", EmergencyContactSchema);