import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },
  lastMessageContent: {
    type: String,
    default: "",
  },
  lastMessageTime: {
    type: Date,
    default: null,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map(),
  },
}, {
  timestamps: true,
});

// Ensure participants array has exactly 2 users
ConversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Conversation must have exactly 2 participants'));
  }
  next();
});

export default mongoose.model("Conversation", ConversationSchema);
