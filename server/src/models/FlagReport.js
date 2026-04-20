import mongoose from 'mongoose';

const flagReportSchema = new mongoose.Schema(
  {
    targetType: { type: String, required: true, enum: ['post', 'response'] },
    targetId: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending' },
  },
  { timestamps: true }
);

flagReportSchema.index({ status: 1, createdAt: -1 });

export const FlagReport = mongoose.model('FlagReport', flagReportSchema);
