import mongoose from 'mongoose';

const savedResourceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  },
  { timestamps: true }
);

savedResourceSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export const SavedResource = mongoose.model('SavedResource', savedResourceSchema);
