import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "./models/User.mjs";
import HealthEntry from "./models/HealthEntry.mjs";
import DailyTask from "./models/DailyTask.mjs";
import MedicalTask from "./models/MedicalTask.mjs";
import Prescription from "./models/Prescription.mjs";
import MoodEntry    from "./models/MoodEntry.mjs";
import authMiddleware from './middleware/Auth.mjs';
import BreathingEntry from './models/BreathingEntry.mjs';
import notificationRoutes from './routes/NotificationRoutes.mjs';
import supportRoutes from "./routes/SupportRoutes.mjs";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/notification-settings', notificationRoutes);
app.use("/api/support", supportRoutes);

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

    res.status(201).json({ message: "User created successfully" });
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

    res.json({
      message: "Login successful",
      user: { username: user.username, email: user.email },
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

    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (error) {
    console.error("Health entry fetch error:", error);
    res.status(500).json({ message: "Server error" });
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


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

