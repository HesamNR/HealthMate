import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ["fitness", "nutrition", "mindfulness"],
      default: "fitness",
    },
    metric: {
      type: String,
      // enum: [
      //   "steps",
      //   "plankTime",
      //   "caloriesBurned",
      //   "distanceKm",
      //   "waterIntakeLiters",
      //   "sleepHours",
      //   "heartRate",
      //   "custom",
      // ],
      enum: ["sum", "max", "min", "average"],
      required: true,
    },
    scoringMethod: {
      type: String,
      enum: ["sum", "max", "min", "average"],
      default: "sum",
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Challenge", ChallengeSchema);
