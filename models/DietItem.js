import mongoose from "mongoose";

const DietItemSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  mealType: { type: String, enum: ["breakfast", "lunch", "dinner"], required: true },
  mealId: String,
  name: String,
  thumb: String
});

export default mongoose.model("DietItem", DietItemSchema);
