import mongoose from "mongoose";

const WorkoutProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercise: {
      type: String,
      required: true,
    },
    history: [
      {
        weight: {
          type: Number,
          required: true,
        },
        sets: {
          type: String,
          required: true,
        },
        reps: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

WorkoutProgressSchema.index({ userId: 1, exercise: 1 }, { unique: true });

export default mongoose.model("WorkoutProgress", WorkoutProgressSchema);
