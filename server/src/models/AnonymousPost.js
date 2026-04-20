import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const anonymousPostSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, unique: true, default: () => uuidv4() },
    content: { type: String, required: true },
    categoryTags: [{ type: String }],
    postOwnerTokenHash: { type: String, required: true },
  },
  { timestamps: true }
);

anonymousPostSchema.index({ createdAt: -1 });

export const AnonymousPost = mongoose.model('AnonymousPost', anonymousPostSchema);
