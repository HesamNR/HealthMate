import mongoose from "mongoose";

const ChallengeProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  history: [
    {
      value: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
});

ChallengeProgressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export default mongoose.model("ChallengeProgress", ChallengeProgressSchema);
