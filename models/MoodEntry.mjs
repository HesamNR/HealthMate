import mongoose from 'mongoose'

const moodEntrySchema = new mongoose.Schema({
  email:  { type: String, required: true, lowercase: true, index: true },  // ← new
  mood:   { type: String, required: true },
  symbol: { type: String, required: true },
  notes:  { type: String, default: '' },
  date:   { type: Date,   default: Date.now }
})

export default mongoose.model('MoodEntry', moodEntrySchema)
