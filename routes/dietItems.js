import express from "express";
import DietItem from "../models/DietItem.js";

const router = express.Router();

// GET items for a user/date/meal
router.get("/", async (req, res) => {
  try {
    const { email, date, meal } = req.query;
    if (!email || !date || !meal) {
      return res.status(400).json({ error: "Missing query params" });
    }
    const items = await DietItem.find({
      email,
      date,
      mealType: meal
    }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new diet item
router.post("/", async (req, res) => {
  try {
    const item = new DietItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE diet item
router.delete("/:id", async (req, res) => {
  try {
    await DietItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
