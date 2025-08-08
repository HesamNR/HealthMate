import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";

import User from "./models/User.mjs";
import HealthEntry from "./models/HealthEntry.mjs";
import DailyTask from "./models/DailyTask.mjs";
import MedicalTask from "./models/MedicalTask.mjs";
import Prescription from "./models/Prescription.mjs";
import MoodEntry    from "./models/MoodEntry.mjs";
import BreathingEntry from './models/BreathingEntry.mjs'
import EmergencyContact from "./models/EmergencyContact.mjs";
import MedicalInfo from "./models/MedicalInfo.mjs";
import Challenge from "./models/Challenges.mjs";
import ChallengeProgress from "./models/ChallengeProgress.mjs";
import ChallengeLog from "./models/ChallengeLog.mjs";
import authMiddleware from './middleware/Auth.mjs';
import notificationRoutes from './routes/NotificationRoutes.mjs';
import supportRoutes from "./routes/SupportRoutes.mjs";
import healthGuideRoutes from "./routes/HealthGuideRoutes.mjs";
import CustomWorkoutPlan from "./models/CustomWorkoutPlan.mjs";
import WorkoutProgress from "./models/WorkoutProgress.mjs";
import Friend from "./models/Friend.mjs";
import Conversation from "./models/Conversation.mjs";
import Message from "./models/Message.mjs";
import DietSuggestion from "./models/DietSuggestion.mjs";
import dietItemsRoutes from "./routes/dietItems.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/notification-settings', notificationRoutes);
app.use("/api/support", supportRoutes);
app.use('/api/health-guide', healthGuideRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Home
app.get("/", (req, res) => {
  res.json({ message: "HealthMate API is live!" });
});

// Register
app.post("/register", async (req, res) => {
  const email = req.body.email.toLowerCase();
  const username = req.body.username.toLowerCase();
  const { password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { identity, password } = req.body;
  const identityLower = identity.toLowerCase();

  try {
    const user = await User.findOne({
      $or: [{ email: identityLower }, { username: identityLower }],
    });

    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password." });

    // Update user's online status when they log in
    await User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastSeen: new Date()
    });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
app.post("/reset-password", async (req, res) => {
  const { username, password } = req.body;
  const identityLower = username.toLowerCase();

  try {
    const user = await User.findOne({
      $or: [{ username: identityLower }, { email: identityLower }],
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get User by Email
app.get("/user", async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update Profile
app.post("/update-profile", async (req, res) => {
  const { email, birthday, age, height, weight, ...rest } = req.body;
  const errors = [];
  const updateData = { ...rest };

  if (birthday && new Date(birthday) > new Date()) {
    errors.push("Birthday cannot be in the future.");
  }

  if (age !== undefined) {
    const a = Number(age);
    if (Number.isNaN(a) || a < 0 || a > 120)
      errors.push("Age must be between 0 and 120.");
    else updateData.age = a;
  }

  if (height !== undefined) {
    const h = Number(height);
    if (Number.isNaN(h) || h < 30 || h > 300)
      errors.push("Height must be between 30 and 300.");
    else updateData.height = h;
  }

  if (weight !== undefined) {
    const w = Number(weight);
    if (Number.isNaN(w) || w < 1 || w > 500)
      errors.push("Weight must be between 1 and 500.");
    else updateData.weight = w;
  }

  if (birthday) updateData.birthday = birthday;
  if (errors.length) return res.status(400).json({ message: errors.join(" ") });

  try {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updateData },
      { new: true }
    );
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- LOGOUT ROUTE ---
app.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Update user's offline status
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Remove from connected users
      connectedUsers.delete(email.toLowerCase());
      console.log(`Removed ${email} from connectedUsers via logout. Current online users:`, Array.from(connectedUsers.keys()));
      
      // Notify all clients that user is offline
      io.emit('user-offline', email.toLowerCase());
      console.log(`User ${email} logged out and is now offline`);
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
});

// --- HEALTH ENTRY ROUTES ---
app.post("/api/health-entry", async (req, res) => {
  try {
    const entry = new HealthEntry(req.body);
    await entry.save();
    res.status(201).json({ message: "Health data saved successfully." });
  } catch (error) {
    console.error("Health entry error:", error);
    res.status(500).json({ message: "Server error while saving health data." });
  }
});


app.get("/api/health-entry", async (req, res) => {
  const { email, date } = req.query;
  if (!email || !date) {
    return res.status(400).json({ message: "Email and date required" });
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  try {
    const entry = await HealthEntry.findOne({
      email: email.toLowerCase(),
      date: { $gte: start, $lt: end },
    });

    // always return 200, even if entry is null
    return res.json(
      entry || {
        email: email.toLowerCase(),
        date: start,
        steps: 0,
        sleep: 0,
        water: 0,
        exercise: 0,
        mood: "Happy",
        reflection: ""
      }
    );
  } catch (error) {
    console.error("Health entry fetch error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


app.put("/api/health-entry", async (req, res) => {
  const { email, date } = req.body;
  if (!email || !date) {
    return res.status(400).json({ message: "Email and date are required" });
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  try {
    const entry = await HealthEntry.findOneAndUpdate(
      { email: email.toLowerCase(), date: { $gte: start, $lt: end } },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ message: "Health data saved successfully.", entry });
  } catch (error) {
    console.error("Health entry update error:", error);
    res.status(500).json({ message: "Server error while saving health data." });
  }
});
app.get("/api/health-entries", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const entries = await HealthEntry.find({ email: email.toLowerCase() }).sort({
      date: -1,
    });
    res.json(entries);
  } catch (err) {
    console.error("Health entries fetch error:", err);
    res.status(500).json({ message: "Server error fetching entries" });
  }
});

// GET all entries for a given user
app.get("/api/health-entries", async (req, res) => {
  const { email } = req.query
  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }
  try {
    const entries = await HealthEntry
      .find({ email: email.toLowerCase() })
      .sort({ date: -1 })
    res.json(entries)
  } catch (err) {
    console.error("Fetch health entries error:", err)
    res.status(500).json({ message: err.message })
  }
})

// --- DAILY TASK ROUTES ---
app.post("/api/daily-tasks", async (req, res) => {
  try {
    console.log("POST /api/daily-tasks body:", req.body);
    const task = new DailyTask(req.body);
    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error("Task create error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
});

app.get("/api/daily-tasks", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const tasks = await DailyTask.find({ email: email.toLowerCase() }).sort({
      date: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.put("/api/daily-tasks/:id", async (req, res) => {
  try {
    const updated = await DailyTask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated", task: updated });
  } catch (err) {
    console.error("Task update error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
});

app.delete("/api/daily-tasks/:id", async (req, res) => {
  try {
    const deleted = await DailyTask.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Task delete error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// --- MEDICAL TASK ROUTES ---
app.post("/api/medical-tasks", async (req, res) => {
  try {
    const task = new MedicalTask(req.body);
    await task.save();
    res.status(201).json({ message: "Medical task created", task });
  } catch (err) {
    console.error("Medical task create error:", err);
    res.status(500).json({ message: "Failed to create medical task" });
  }
});

app.get("/api/medical-tasks", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const tasks = await MedicalTask.find({ email: email.toLowerCase() }).sort({
      date: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error("Fetch medical tasks error:", err);
    res.status(500).json({ message: "Failed to fetch medical tasks" });
  }
});

app.put("/api/medical-tasks/:id", async (req, res) => {
  try {
    const updated = await MedicalTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Medical task not found" });
    res.json({ message: "Medical task updated", task: updated });
  } catch (err) {
    console.error("Medical task update error:", err);
    res.status(500).json({ message: "Failed to update medical task" });
  }
});

app.delete("/api/medical-tasks/:id", async (req, res) => {
  try {
    const deleted = await MedicalTask.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Medical task not found" });
    res.json({ message: "Medical task deleted" });
  } catch (err) {
    console.error("Medical task delete error:", err);
    res.status(500).json({ message: "Failed to delete medical task" });
  }
});

// --- PRESCRIPTION ROUTES ---
app.post("/api/prescriptions", async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json({ message: "Prescription added", prescription });
  } catch (err) {
    console.error("Create prescription error:", err);
    res.status(500).json({ message: "Failed to add prescription" });
  }
});

app.get("/api/prescriptions", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const prescriptions = await Prescription.find({
      email: email.toLowerCase(),
    }).sort({ date: -1 });
    res.json(prescriptions);
  } catch (err) {
    console.error("Fetch prescription error:", err);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
});

app.put("/api/prescriptions/:id/refill", async (req, res) => {
  try {
    const updated = await Prescription.findByIdAndUpdate(
      req.params.id,
      { $inc: { refillCount: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Refilled", prescription: updated });
  } catch (err) {
    console.error("Refill error:", err);
    res.status(500).json({ message: "Refill failed" });
  }
});

app.delete("/api/prescriptions/:id", async (req, res) => {
  try {
    const deleted = await Prescription.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Prescription deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete" });
  }
});

const notificationRouter = express.Router();

// GET current user's notification settings
notificationRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notificationSettings');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.notificationSettings);
  } catch (err) {
    console.error('Error getting notification settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE notification settings
notificationRouter.put('/', authMiddleware, async (req, res) => {
  try {
    const { healthAlerts, reminders, aiSuggestions } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'notificationSettings.healthAlerts': healthAlerts,
          'notificationSettings.reminders': reminders,
          'notificationSettings.aiSuggestions': aiSuggestions,
        },
      },
      { new: true }
    ).select('notificationSettings');

    res.json(updated.notificationSettings);
  } catch (err) {
    console.error('Error updating notification settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mood Entry
app.post('/api/mood-entry', async (req, res) => {
  try {
    // req.body must include { email, mood, symbol, notes, date }
    const entry = new MoodEntry(req.body)
    await entry.save()
    res.status(201).json(entry)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

// GET the history for one email
app.get('/api/mood-entries', async (req, res) => {
  const { email, from, to } = req.query
  if (!email) return res.status(400).json({ message: 'Email required' })

  const filter = { email: email.toLowerCase() }
  if (from || to) {
    filter.date = {}
    if (from) filter.date.$gte = new Date(from)
    if (to)   filter.date.$lte = new Date(to)
  }

  try {
    const entries = await MoodEntry.find(filter).sort({ date: -1 })
    res.json(entries)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

// DELETE by id
app.delete('/api/mood-entry/:id', async (req, res) => {
  try {
    await MoodEntry.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})


//Breathing Entries
// POST 
app.post('/api/breathing-entry', async (req, res) => {
  try {
    const entry = new BreathingEntry(req.body)
    await entry.save()
    res.status(201).json(entry)
  } catch (e) { res.status(500).json({ message: e.message }) }
})

// GET 
app.get('/api/breathing-entries', async (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ message: 'Email required' })
  const entries = await BreathingEntry.find({ email: email.toLowerCase() }).sort({ date: -1 })
  res.json(entries)
})

// DELETE
app.delete('/api/breathing-entry/:id', async (req, res) => {
  await BreathingEntry.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

// create challenge
app.post("/api/challenges", async (req, res) => {
  const {
    name,
    description,
    startDate,
    endDate,
    category,
    metric,
    scoringMethod,
  } = req.body;

  try {
    const challenge = new Challenge({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category,
      metric,
      scoringMethod,
    });

    await challenge.save();
    res.status(201).json({ message: "Challenge created", challenge });
  } catch (err) {
    console.error("Create challenge error:", err);
    res.status(500).json({ message: "Server error creating challenge" });
  }
});

app.get("/api/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    console.error("Get challenges error:", err);
    res.status(500).json({ message: "Server error fetching challenges" });
  }
});

// join challenge
app.post("/api/challenges/:id/join", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    // Prevent double-joining
    if (challenge.participants.includes(userId)) {
      return res.status(400).json({ message: "User already joined" });
    }

    challenge.participants.push(userId);
    await challenge.save();

    res.json({ message: "Joined challenge successfully", challenge });
  } catch (err) {
    console.error("Join challenge error:", err);
    res.status(500).json({ message: "Server error joining challenge" });
  }
});

// update progress
app.post("/api/challenges/:id/progress", async (req, res) => {
  const { id } = req.params;
  const { userId, value } = req.body;
  if (!userId || value === undefined) return res.status(400).json({ message: "userId and value are required" });

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const now = new Date();
    if (now < challenge.startDate || now > challenge.endDate)
      return res.status(400).json({ message: "Challenge is not active" });

    const log = new ChallengeLog({ userId, challengeId: id, value });
    await log.save();

    res.json({ message: "Log entry created", log });
  } catch (err) {
    console.error("Create log error:", err);
    res.status(500).json({ message: "Server error logging progress" });
  }
});

// get leaderboard
app.get("/api/challenges/:id/leaderboard", async (req, res) => {
  const { id } = req.params;

  try {
    const leaderboard = await ChallengeProgress.find({ challengeId: id })
      .populate("userId", "name email")
      .sort({ progress: -1 })
      .limit(10);

    res.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error fetching leaderboard" });
  }
});

// Get challenges joined by userId
app.get("/api/user/:userId/challenges", async (req, res) => {
  const { userId } = req.params;

  try {
    const joinedChallenges = await Challenge.find({ participants: userId });
    res.json(joinedChallenges);
  } catch (err) {
    console.error("Get joined challenges error:", err);
    res
      .status(500)
      .json({ message: "Server error fetching joined challenges" });
  }
});

// leave challenge
app.post("/api/challenges/:id/leave", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    const index = challenge.participants.indexOf(userId);
    if (index === -1) {
      return res
        .status(400)
        .json({ message: "User has not joined this challenge" });
    }

    challenge.participants.splice(index, 1); 
    await challenge.save();

    // Optionally, also remove their progress:
    await ChallengeProgress.deleteOne({ challengeId: id, userId });

    res.json({ message: "Left challenge successfully", challenge });
  } catch (err) {
    console.error("Leave challenge error:", err);
    res.status(500).json({ message: "Server error leaving challenge" });
  }
});

app.get("/api/challenge-metadata", (req, res) => {
  res.json({
    categories: Challenge.schema.path("category").enumValues,
    metrics: Challenge.schema.path("metric").enumValues,
    scoringMethods: Challenge.schema.path("scoringMethod").enumValues,
  });
});

// DELETE /api/challenges/:id
app.delete("/api/challenges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Challenge.findByIdAndDelete(id);
    res.json({ message: "Challenge deleted" });
  } catch (err) {
    console.error("Delete challenge error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/challenges/:id/logs", async (req, res) => {
  const { id } = req.params;
  try {
    const logs = await ChallengeLog.find({ challengeId: id })
      .populate("userId", "name email") 
      .sort({ date: -1 }); 

    res.json({ logs });
  } catch (err) {
    console.error("Fetch logs error:", err);
    res.status(500).json({ message: "Server error fetching logs" });
  }
});



// Get emergency contacts by user email
app.get("/api/emergency-contacts", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });
  try {
    const contacts = await EmergencyContact.find({ email: email.toLowerCase() });
    res.json(contacts);
  } catch (err) {
    console.error("Fetch contacts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Replace emergency contacts for a user
app.put("/api/emergency-contacts", async (req, res) => {
  const { email, contacts } = req.body;
  if (!email || !Array.isArray(contacts)) {
    return res.status(400).json({ message: "Email and contacts required" });
  }
  try {
    await EmergencyContact.deleteMany({ email: email.toLowerCase() });
     const docs = contacts
      .filter(
        (c) =>
          c.name && c.phone && c.address && c.relationship
      )
      .map((c) => ({ ...c, email: email.toLowerCase() }));
    if (docs.length > 0) {
      await EmergencyContact.insertMany(docs);
    }
    res.json({ message: "Contacts saved" });
  } catch (err) {
    console.error("Save contacts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get medical information by user email
app.get("/api/medical-info", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });
  try {
    const info = await MedicalInfo.findOne({ email: email.toLowerCase() });
    if (!info) return res.status(404).json({});
    res.json(info);
  } catch (err) {
    console.error("Fetch medical info error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update medical information for a user
app.put("/api/medical-info", async (req, res) => {
     const { email, name, address, ...rest } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  try {
      const update = { ...rest };
    if (name !== undefined) update.name = name;
    if (address !== undefined) update.address = address;
    const info = await MedicalInfo.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: update },
      { new: true, upsert: true }
    );

      const profileUpdate = {};
    if (name !== undefined) profileUpdate.name = name;
    if (address !== undefined) profileUpdate.location = address;
    if (Object.keys(profileUpdate).length) {
      await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $set: profileUpdate }
      );
    }

    res.json(info);
  } catch (err) {
    console.error("Save medical info error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Spoonacular API key
const SPOONACULAR_API_KEY = "f42f4ca755f24da787007574e27eed5a";

// Search recipes by query
app.get("/api/recipes/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          query,
          addRecipeNutrition: true,
          number: 10,
          apiKey: SPOONACULAR_API_KEY,
        },
      }
    );

    const recipes = (response.data?.results || []).map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      calories:
        r.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount ??
        null,
      carbs:
        r.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")
          ?.amount ?? null,
      protein:
        r.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount ??
        null,
    }));

    return res.json({ recipes });
  } catch (err) {
    // When daily quota is exceeded Spoonacular returns 402
    if (err?.response?.status === 402) {
      return res.status(200).json({ quotaExceeded: true });
    }
    console.error("Recipe search error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "Error fetching recipes" });
  }
});
// Get recipe details
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.id}/information`,
      {
        params: { apiKey: SPOONACULAR_API_KEY },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Recipe details error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching recipe details" });
  }
});

app.post("/api/custom-workout", async (req, res) => {
  console.log("Request body:", req.body);
  console.log("POST /api/custom-workout - Body:", req.body);
  const { userId, name, days } = req.body;

  if (!userId || !days) {
    return res.status(400).json({ message: "userId and days are required" });
  }

  try {
    let existingPlan = await CustomWorkoutPlan.findOne({ userId });

    if (existingPlan) {
      existingPlan.name = name || existingPlan.name;
      existingPlan.days = days;
      await existingPlan.save();
      return res.status(200).json({
        message: "Plan updated successfully",
        savedPlan: existingPlan,
      });
    }

    const savedPlan = new CustomWorkoutPlan({
      userId,
      name: name || "Custom Plan",
      days,
    });

    await savedPlan.save();
    res.status(201).json({ message: "Plan saved successfully", savedPlan });
  } catch (err) {
    console.error("Save custom plan error:", err);
    res.status(500).json({ message: "Server error saving custom plan" });
  }
});

app.get("/api/custom-workout/user/:userId", async (req, res) => {
  const { userId } = req.params;
  //console.log("GET custom plan for userId:", userId);
  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    const plan = await CustomWorkoutPlan.findOne({ userId });

    if (!plan) return res.status(404).json({ message: "No custom plan found" });

    res.json(plan);
  } catch (err) {
    console.error("Fetch custom plan error:", err);
    res.status(500).json({ message: "Server error fetching plan" });
  }
});

app.delete("/api/custom-workout/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log("Delete request received for userId:", userId);

    // Try casting to ObjectId (adjust later if needed)
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // 🔍 DEBUG: Check if any plans exist for this user
    const plans = await CustomWorkoutPlan.find({ userId: objectUserId });
    console.log("Plans found:", plans);

    // Proceed with deletion
    const result = await CustomWorkoutPlan.deleteOne({ userId: objectUserId });
    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No custom plan found to delete." });
    }

    res.status(200).json({ message: "Custom plan deleted successfully." });
  } catch (error) {
    console.error("Error deleting custom plan:", error);
    res.status(500).json({ message: "Failed to delete custom plan" });
  }
});

app.patch("/api/users/:id/select-plan", async (req, res) => {
  const { id } = req.params;
  const { currentPlan } = req.body;

  console.log("Incoming currentPlan:", currentPlan);

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.currentPlan = currentPlan;
    await user.save();

    console.log("Updated user:", user);

    res.status(200).json(user); // return full user for verification
  } catch (error) {
    console.error("Error saving selected plan:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users for discovery
app.get("/api/users", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Get all users except the current user
    const users = await User.find({ 
      email: { $ne: email.toLowerCase() } 
    }).select('name username email profileImage isOnline lastSeen');

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/api/users/:id/set-plan", async (req, res) => {
  try {
    const { plan } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { currentPlan: plan },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send("User not found");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/api/workout-progress/:exercise/log", async (req, res) => {
  const { exercise } = req.params;
  const { userId, weight, sets, reps } = req.body;

  if (!userId || weight == null || sets == null || reps == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let progress = await WorkoutProgress.findOne({ userId, exercise });

    if (!progress) {
      progress = new WorkoutProgress({
        userId,
        exercise,
        history: [{ weight, sets, reps, date: new Date() }],
      });
    } else {
      progress.history.push({ weight, sets, reps, date: new Date() });
    }

    await progress.save();

    res.json({ message: "Workout progress logged", progress });
  } catch (err) {
    console.error("Workout log error:", err);
    res.status(500).json({ message: "Server error logging workout progress" });
  }
});

app.get("/api/workout-progress/:exercise", async (req, res) => {
  const { exercise } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const progress = await WorkoutProgress.findOne({ userId, exercise });

    if (!progress || !progress.history.length) {
      return res.json([]); // return empty array if no history
    }

    // Sort by date descending (latest first)
    const sortedHistory = [...progress.history].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(sortedHistory);
  } catch (err) {
    console.error("Error fetching workout progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CHAT ROUTES
// Get all friends for a user
app.get("/api/chat/friends", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const friends = await Friend.find({
      $or: [
        { userId: user._id, status: 'accepted' },
        { friendId: user._id, status: 'accepted' }
      ]
    }).populate('userId', 'name username email isOnline lastSeen')
      .populate('friendId', 'name username email isOnline lastSeen');

    const friendsList = friends.map(friend => {
      const isUser = friend.userId._id.toString() === user._id.toString();
      const friendData = isUser ? friend.friendId : friend.userId;
      return {
        _id: friendData._id,
        name: friendData.name || friendData.username,
        username: friendData.username,
        email: friendData.email,
        isOnline: friendData.isOnline,
        lastSeen: friendData.lastSeen,
        friendshipId: friend._id
      };
    });

    res.json(friendsList);
  } catch (err) {
    console.error('Get friends error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending friend requests
app.get("/api/chat/friends/pending", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const pendingRequests = await Friend.find({
      friendId: user._id,
      status: 'pending'
    }).populate('userId', 'name username email');

    res.json(pendingRequests);
  } catch (err) {
    console.error('Get pending requests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send friend request
app.post("/api/chat/friends/request", async (req, res) => {
  const { email, friendEmail } = req.body;
  if (!email || !friendEmail) {
    return res.status(400).json({ message: 'Email and friend email required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    const friend = await User.findOne({ email: friendEmail.toLowerCase() });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === friend._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as friend' });
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findOne({
      $or: [
        { userId: user._id, friendId: friend._id },
        { userId: friend._id, friendId: user._id }
      ]
    });

    if (existingFriendship) {
      return res.status(400).json({ message: 'Friendship already exists' });
    }

    const newFriendship = new Friend({
      userId: user._id,
      friendId: friend._id,
      status: 'pending'
    });

    await newFriendship.save();
    res.json({ message: 'Friend request sent' });
  } catch (err) {
    console.error('Send friend request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
app.post("/api/chat/friends/accept", async (req, res) => {
  const { friendshipId } = req.body;
  if (!friendshipId) {
    return res.status(400).json({ message: 'Friendship ID required' });
  }

  try {
    const friendship = await Friend.findByIdAndUpdate(
      friendshipId,
      { status: 'accepted', acceptedAt: new Date() },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Accept friend request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversations for a user
app.get("/api/chat/conversations", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const conversations = await Conversation.find({
      participants: user._id
    }).populate('participants', 'name username email isOnline lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    const conversationsList = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== user._id.toString());
      return {
        _id: conv._id,
        participant: otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageContent: conv.lastMessageContent,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: conv.unreadCount.get(user._id.toString()) || 0
      };
    });

    res.json(conversationsList);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a conversation
app.get("/api/chat/messages", async (req, res) => {
  const { conversationId } = req.query;
  if (!conversationId) return res.status(400).json({ message: 'Conversation ID required' });

  try {
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name username email')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or get conversation
app.post("/api/chat/conversations", async (req, res) => {
  const { email, friendEmail } = req.body;
  if (!email || !friendEmail) {
    return res.status(400).json({ message: 'Email and friend email required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    const friend = await User.findOne({ email: friendEmail.toLowerCase() });

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [user._id, friend._id] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [user._id, friend._id]
      });
      await conversation.save();
    }

    res.json({ conversationId: conversation._id });
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new message
app.post("/api/chat/messages", async (req, res) => {
  const { conversationId, senderId, content } = req.body;
  if (!conversationId || !senderId || !content) {
    return res.status(400).json({ message: 'Conversation ID, sender ID, and content required' });
  }

  try {
    const message = new Message({
      conversationId,
      senderId,
      content: content.trim()
    });

    await message.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageContent: content.trim(),
      lastMessageTime: message.timestamp
    });

    // Populate sender info before sending response
    await message.populate('senderId', 'name username email');

    res.status(201).json(message);
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Socket.IO event handlers
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their email
  socket.on('join', async (userEmail) => {
    try {
      const user = await User.findOne({ email: userEmail.toLowerCase() });
      if (user) {
        connectedUsers.set(userEmail, socket.id);
        socket.userEmail = userEmail;
        console.log(`Added ${userEmail} to connectedUsers. Current online users:`, Array.from(connectedUsers.keys()));
        
        // Update user's online status
        await User.findByIdAndUpdate(user._id, {
          isOnline: true,
          lastSeen: new Date()
        });

        // Notify all clients that user is online
        io.emit('user-online', userEmail);
        console.log(`User ${userEmail} is now online`);
        
        // Also emit to the specific user to confirm their online status
        socket.emit('user-online', userEmail);
        
        // Deliver any pending messages for this user
        const userConversations = await Conversation.find({ participants: user._id });
        const conversationIds = userConversations.map(c => c._id);
        
        const pendingMessages = await Message.find({
          conversationId: { $in: conversationIds },
          senderId: { $ne: user._id },
          status: 'sent'
        }).populate('senderId');
        
        if (pendingMessages.length > 0) {
          for (const message of pendingMessages) {
            await Message.findByIdAndUpdate(message._id, { status: 'delivered' });
            socket.emit('receive-message', {
              conversationId: message.conversationId,
              messageId: message._id,
              content: message.content,
              senderEmail: message.senderId.email,
              timestamp: message.timestamp,
              status: 'delivered'
            });
          }
          console.log(`Delivered ${pendingMessages.length} pending messages to ${userEmail}`);
        }
      }
    } catch (err) {
      console.error('Socket join error:', err);
    }
  });

  // Join a conversation room
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation-${conversationId}`);
  });

  // Leave a conversation room
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation-${conversationId}`);
  });

  // Handle new message
  socket.on('send-message', async (data) => {
    try {
      const { conversationId, senderEmail, content, messageId } = data;
      
      console.log('Message received:', { conversationId, senderEmail, content, messageId });
      
      // First, emit "sent" status to sender immediately
      socket.emit('message-sent', { messageId, conversationId });
      
      // Get conversation participants to check who's online
      const conversation = await Conversation.findById(conversationId).populate('participants');
      const participants = conversation.participants;
      const onlineParticipants = participants.filter(p => connectedUsers.has(p.email));
      
      // If there are online participants (excluding sender), mark as delivered
      const onlineRecipients = onlineParticipants.filter(p => p.email !== senderEmail);
      
      console.log('Message status check:', {
        senderEmail,
        participants: participants.map(p => ({ email: p.email, isOnline: connectedUsers.has(p.email) })),
        onlineRecipients: onlineRecipients.map(p => p.email),
        connectedUsers: Array.from(connectedUsers.keys())
      });
      
      if (onlineRecipients.length > 0) {
        // Update message status to 'delivered' in database
        await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
        
        // Get sender information
        const sender = await User.findOne({ email: senderEmail });
        const senderName = sender ? (sender.name || sender.username) : 'Unknown User';
        
        // Emit to all online users in the conversation EXCEPT the sender
        const messageData = {
          conversationId,
          messageId,
          content,
          senderEmail,
          senderName,
          timestamp: new Date(),
          status: 'delivered'
        };
        
        console.log('Server: Emitting receive-message to conversation:', conversationId);
        console.log('Server: Message data:', messageData);
        console.log('Server: Online recipients:', onlineRecipients.map(p => p.email));
        
        socket.to(`conversation-${conversationId}`).emit('receive-message', messageData);

        // Also emit a notification event to all online users (for desktop notifications)
        // This will be received by users who are not currently in the chat
        io.emit('chat-notification', {
          ...messageData,
          type: 'new-message'
        });

        // Emit delivery confirmation to sender after a short delay
        setTimeout(() => {
          socket.emit('message-delivered', { messageId, conversationId });
          console.log('Message delivered confirmation sent for:', messageId);
        }, 500);
      } else {
        // No online participants - message stays as "sent"
        console.log('No online participants, message remains as sent');
      }
      
      console.log('Message broadcasted to conversation:', conversationId);
    } catch (err) {
      console.error('Send message error:', err);
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(`conversation-${data.conversationId}`).emit('user-typing', {
      conversationId: data.conversationId,
      userEmail: data.userEmail
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(`conversation-${data.conversationId}`).emit('user-stop-typing', {
      conversationId: data.conversationId,
      userEmail: data.userEmail
    });
  });

  // Handle message read status
  socket.on('message-read', async (data) => {
    try {
      const { conversationId, messageIds } = data;
      
      console.log('Marking messages as read:', { conversationId, messageIds });
      
      // Update messages as read in database
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { status: 'read', readAt: new Date() }
      );

      // Notify all participants in the conversation
      io.to(`conversation-${conversationId}`).emit('messages-read', {
        conversationId,
        messageIds
      });
      
      console.log('Messages marked as read and broadcasted');
    } catch (err) {
      console.error('Message read error:', err);
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.userEmail) {
      connectedUsers.delete(socket.userEmail);
      console.log(`Removed ${socket.userEmail} from connectedUsers. Current online users:`, Array.from(connectedUsers.keys()));
      
      // Update user's offline status
      try {
        const user = await User.findOne({ email: socket.userEmail.toLowerCase() });
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            isOnline: false,
            lastSeen: new Date()
          });

          // Notify all clients that user is offline
          io.emit('user-offline', socket.userEmail);
          console.log(`User ${socket.userEmail} is now offline`);
        }
      } catch (err) {
        console.error('Socket disconnect error:', err);
      }
    }
  });
});

// ---------- Diet Suggestions (per user) ----------
app.get("/api/diet-suggestions", async (req, res) => {
  try {
    const { email, mealType } = req.query;
    if (!email) return res.status(400).json({ message: "email is required" });

    const query = { email: email.toLowerCase() };
    if (mealType) query.mealType = mealType;

    const items = await DietSuggestion.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("GET /api/diet-suggestions", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/diet-suggestions", async (req, res) => {
  try {
    const { email, mealType, name, imageUrl, kcalPer100g, protein, fat, carbs } = req.body;
    if (!email || !mealType || !name) {
      return res.status(400).json({ message: "email, mealType, and name are required" });
    }

    const item = new DietSuggestion({
      email: email.toLowerCase(),
      mealType,
      name,
      imageUrl,
      kcalPer100g,
      protein,
      fat,
      carbs,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("POST /api/diet-suggestions", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/diet-suggestions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await DietSuggestion.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/diet-suggestions/:id", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/api/diet-items", dietItemsRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
