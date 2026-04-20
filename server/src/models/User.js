import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const privacySettingsSchema = new mongoose.Schema(
  {
    anonymityInCommunity: { type: Boolean, default: true },
    dataSharingEnabled: { type: Boolean, default: false },
    visibility: { type: String, enum: ['private', 'self', 'trusted'], default: 'private' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    privacySettings: { type: privacySettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
