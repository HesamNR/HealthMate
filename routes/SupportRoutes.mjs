// routes/SupportRoutes.mjs
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Define SupportResource schema (or import if already exists)
const SupportResourceSchema = new mongoose.Schema({
  category: String,
  title: String,
  content: String,
  tags: [String],
  created_at: Date,
  updated_at: Date,
});

const SupportResource = mongoose.model("SupportResource", SupportResourceSchema);

// GET /api/support/faqs
router.get("/faqs", async (req, res) => {
  try {
    const faqs = await SupportResource.find({ category: "FAQ" }).sort({ created_at: -1 });
    res.json(faqs);
  } catch (err) {
    console.error("Failed to fetch FAQs:", err);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// POST /api/support/questions
router.post("/questions", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question cannot be empty" });
    }

    // This should log in the terminal
    console.log("📩 New question submitted:", question);

    const newQuestion = new SupportResource({
      category: "UserQuestion",
      title: question,
      content: "",
      tags: [],
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question submitted successfully" });
  } catch (err) {
    console.error("❌ Failed to submit question:", err);
    res.status(500).json({ error: "Failed to submit question" });
  }
});



// GET /api/support/questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await SupportResource.find({ category: "UserQuestion" }).sort({ created_at: -1 });
    res.json(questions);
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    res.status(500).json({ error: "Failed to fetch user questions" });
  }
});


export default router;