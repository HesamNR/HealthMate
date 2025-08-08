import mongoose from "mongoose";

const ChallengeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("ChallengeLog", ChallengeLogSchema);
