// routes/NotificationRoutes.mjs
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Define schema for notification settings
const NotificationSettingsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  notifications: {
    healthAlerts: { type: Boolean, default: false },
    reminders: { type: Boolean, default: false },
    aiSuggestions: { type: Boolean, default: false },
  },
});

const NotificationSettings = mongoose.model("NotificationSettings", NotificationSettingsSchema);

// GET /api/notification-settings?email=...
router.get("/notification-settings", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    let settings = await NotificationSettings.findOne({ email });
    if (!settings) {
      // Create default settings if not found
      settings = await NotificationSettings.create({ email });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// PUT /api/notification-settings
router.put("/notification-settings", async (req, res) => {
  const { email, notifications } = req.body;

  if (!email || !notifications) {
    return res.status(400).json({ error: "Email and notification object required" });
  }

  try {
    const updated = await NotificationSettings.findOneAndUpdate(
      { email },
      { notifications },
      { new: true, upsert: true }
    );
    res.json({ message: "Settings updated", settings: updated });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
