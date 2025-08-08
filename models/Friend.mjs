import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "blocked"],
    default: "pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Ensure unique friend relationships
FriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export default mongoose.model("Friend", FriendSchema);
