import { Router } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { body, param, query } from 'express-validator';
import { AnonymousPost } from '../models/AnonymousPost.js';
import { Response as ResponseModel } from '../models/Response.js';
import { authOptional, authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { postLimiter } from '../middleware/rateLimit.js';
import { detectCrisisKeywords, getCrisisPayload } from '../services/crisisDetection.js';
import { CrisisContact } from '../models/CrisisContact.js';
import { Resource } from '../models/Resource.js';
import { getIo } from '../socket.js';

const router = Router();
const PAGE_SIZE = 20;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

router.post(
  '/',
  authOptional,
  postLimiter,
  [
    body('content').isString().trim().isLength({ min: 1, max: 2000 }),
    body('categoryTags').optional().isArray(),
    body('categoryTags.*').optional().isString().trim(),
    body('postOwnerToken').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      if (detectCrisisKeywords(req.body.content)) {
        const crisisContacts = await CrisisContact.find().sort({ order: 1 }).lean();
        const crisisResources = await Resource.find({ isCrisis: true }).lean();
        const payload = getCrisisPayload([...crisisContacts, ...crisisResources]);
        return res.status(200).json({ ...payload, postCreated: false });
      }
      const postOwnerToken = req.body.postOwnerToken || crypto.randomBytes(24).toString('hex');
      const postOwnerTokenHash = hashToken(postOwnerToken);
      const post = await AnonymousPost.create({
        content: req.body.content.trim(),
        categoryTags: Array.isArray(req.body.categoryTags) ? req.body.categoryTags : [],
        postOwnerTokenHash,
      });
      const io = getIo();
      if (io) io.emit('post:new', { postId: post.postId, createdAt: post.createdAt });
      res.status(201).json({
        post: {
          postId: post.postId,
          content: post.content,
          categoryTags: post.categoryTags,
          createdAt: post.createdAt,
        },
        postOwnerToken,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/',
  authOptional,
  [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 })],
  validate,
  async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(PAGE_SIZE, parseInt(req.query.limit, 10) || PAGE_SIZE);
      const skip = (page - 1) * limit;
      const [posts, total] = await Promise.all([
        AnonymousPost.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        AnonymousPost.countDocuments(),
      ]);
      const list = posts.map((p) => ({
        postId: p.postId,
        content: p.content,
        categoryTags: p.categoryTags,
        createdAt: p.createdAt,
        _id: p._id,
      }));
      res.json({ posts: list, total, page, limit });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/:id',
  authOptional,
  [param('id').isString().trim()],
  validate,
  async (req, res, next) => {
    try {
      let post = await AnonymousPost.findOne({ postId: req.params.id }).lean();
      if (!post && mongoose.Types.ObjectId.isValid(req.params.id) && String(new mongoose.Types.ObjectId(req.params.id)) === req.params.id) {
        post = await AnonymousPost.findById(req.params.id).lean();
      }
      if (!post) return res.status(404).json({ error: 'Post not found' });
      const responses = await ResponseModel.find({ postId: post._id }).sort({ createdAt: 1 }).lean();
      res.json({
        post: {
          postId: post.postId,
          content: post.content,
          categoryTags: post.categoryTags,
          createdAt: post.createdAt,
          _id: post._id,
        },
        responses: responses.map((r) => ({
          id: r._id,
          content: r.content,
          createdAt: r.createdAt,
        })),
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/:id/responses',
  authOptional,
  postLimiter,
  [
    param('id').isString().trim(),
    body('content').isString().trim().isLength({ min: 1, max: 2000 }),
    body('responseOwnerToken').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      if (detectCrisisKeywords(req.body.content)) {
        const crisisContacts = await CrisisContact.find().sort({ order: 1 }).lean();
        const crisisResources = await Resource.find({ isCrisis: true }).lean();
        const payload = getCrisisPayload([...crisisContacts, ...crisisResources]);
        return res.status(200).json({ ...payload, responseCreated: false });
      }
      let post = await AnonymousPost.findOne({ postId: req.params.id });
      if (!post && mongoose.Types.ObjectId.isValid(req.params.id) && String(new mongoose.Types.ObjectId(req.params.id)) === req.params.id) {
        post = await AnonymousPost.findById(req.params.id);
      }
      if (!post) return res.status(404).json({ error: 'Post not found' });
      const responseOwnerToken = req.body.responseOwnerToken || crypto.randomBytes(24).toString('hex');
      const responseOwnerTokenHash = hashToken(responseOwnerToken);
      const response = await ResponseModel.create({
        postId: post._id,
        content: req.body.content.trim(),
        responseOwnerTokenHash,
      });
      const io = getIo();
      if (io) {
        io.emit('response:new', { postId: post.postId, responseId: response._id });
        io.emit('notification:reply', { postId: post.postId });
      }
      res.status(201).json({
        response: {
          id: response._id,
          content: response.content,
          createdAt: response.createdAt,
        },
        responseOwnerToken,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
