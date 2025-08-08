import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  exercise: String,
  sets: String,
  reps: String,
});

const WorkoutDaySchema = new mongoose.Schema({
  day: String,
  exercises: [ExerciseSchema],
});

const CustomWorkoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  name: { type: String, required: true },
  days: [WorkoutDaySchema],
});

export default mongoose.model("CustomWorkoutPlan", CustomWorkoutPlanSchema);