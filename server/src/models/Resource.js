import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['hotline', 'campus', 'therapy', 'support_group', 'app', 'local', 'other'] },
    contactInfo: { type: String, default: '' },
    description: { type: String, default: '' },
    hours: { type: String, default: '' },
    cost: { type: String, enum: ['free', 'low', 'sliding', 'paid', 'unknown'], default: 'unknown' },
    availability: { type: String, enum: ['24/7', 'business', 'weekdays', 'weekends', 'varies', 'unknown'], default: 'unknown' },
    languages: [{ type: String }],
    website: { type: String, default: '' },
    location: { type: String, default: '' },
    isCrisis: { type: Boolean, default: false },
  },
  { timestamps: true }
);

resourceSchema.index({ type: 1, cost: 1, availability: 1 });
resourceSchema.index({ name: 'text', description: 'text' });

export const Resource = mongoose.model('Resource', resourceSchema);
