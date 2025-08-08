import mongoose from "mongoose";

const MedicalTaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: "",
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const MedicalTask = mongoose.model("MedicalTask", MedicalTaskSchema);

export default MedicalTask;
