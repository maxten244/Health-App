import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moodScore: { type: Number, required: true, min: 1, max: 10 },
    notes: { type: String, default: '' },
    tags: [{ type: String, enum: ['sleep', 'exercise', 'social', 'work', 'weather', 'food', 'other'] }],
  },
  { timestamps: true }
);

moodEntrySchema.index({ userId: 1, createdAt: -1 });

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
