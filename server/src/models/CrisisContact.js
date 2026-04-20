import mongoose from 'mongoose';

const crisisContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, default: '' },
    availability: { type: String, default: '24/7' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CrisisContact = mongoose.model('CrisisContact', crisisContactSchema);
