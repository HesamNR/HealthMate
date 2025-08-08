import mongoose from "mongoose";

const DietSuggestionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true }, // user scoping
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner"], required: true, index: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    kcalPer100g: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }, // grams / 100g
    fat: { type: Number, default: 0 },     // grams / 100g
    carbs: { type: Number, default: 0 },   // grams / 100g
  },
  { timestamps: true }
);

export default mongoose.model("DietSuggestion", DietSuggestionSchema);
