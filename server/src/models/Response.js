import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnonymousPost', required: true },
    content: { type: String, required: true },
    responseOwnerTokenHash: { type: String, required: true },
  },
  { timestamps: true }
);

responseSchema.index({ postId: 1, createdAt: 1 });

export const Response = mongoose.model('Response', responseSchema);
