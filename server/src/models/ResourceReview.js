import mongoose from 'mongoose';

const resourceReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

resourceReviewSchema.index({ resourceId: 1 });
resourceReviewSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export const ResourceReview = mongoose.model('ResourceReview', resourceReviewSchema);
