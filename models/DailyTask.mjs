import mongoose from "mongoose";

const DailyTaskSchema = new mongoose.Schema({
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
    type: String, // Example: "08:00 AM"
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
    default: () => new Date(), // stores the date task was created
  },
});

const DailyTask = mongoose.model("DailyTask", DailyTaskSchema);

export default DailyTask;
