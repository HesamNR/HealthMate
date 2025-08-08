import mongoose from "mongoose";

const WeeklyStatSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    steps: { type: Number, default: 0 },
    sleep: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },
  },
  { _id: false }
);

const DeviceMetricSchema = new mongoose.Schema(
  {
    recordedAt: { type: Date, default: Date.now },
    restingHeartRate: { type: Number },
    hrvStatus: { type: String },
    vo2Max: { type: Number },
    currentHeartRate: { type: Number },
    stressLevel: { type: Number },
    batteryLevel: { type: Number },
  },
  { _id: false }
);

const DeviceSchema = new mongoose.Schema(
  {
    deviceName: { type: String },
    deviceType: { type: String },
    deviceIdentifier: { type: String },
    apiProvider: { type: String },
    lastSynced: { type: Date },
    metrics: [DeviceMetricSchema],
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    name: { type: String, default: "" },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["Female", "Male", "Other", "Prefer not to say"],
    },
    birthday: { type: Date },
    height: { type: Number },
    weight: { type: Number },
    location: { type: String, default: "" },
    goals: { type: String, default: "" },

    steps: { type: Number, default: 0 },
    waterIntakeLiters: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    mood: { type: String, default: "" },
    caloriesConsumed: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },

    // ✅ Merged notification settings
    notificationSettings: {
      healthAlerts: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      aiSuggestions: { type: Boolean, default: true },
    },

    weeklyStats: [WeeklyStatSchema],
    devices: [DeviceSchema],

    currentPlan: { type: String },

    // Chat-related fields
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    profileImage: { type: String, default: null }
  },
  {
    timestamps: true,
  }
  
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

