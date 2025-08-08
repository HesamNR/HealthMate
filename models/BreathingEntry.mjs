// server/models/BreathingEntry.mjs
import mongoose from 'mongoose'

const breathingEntrySchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true, index: true },
  technique: { type: String, required: true },
  duration:  { type: Number, required: true },
  notes:     { type: String, default: '' },
  date:      { type: Date,   default: Date.now },
})

export default mongoose.model('BreathingEntry', breathingEntrySchema)
