import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { Resource } from '../models/Resource.js';
import { SavedResource } from '../models/SavedResource.js';
import { ResourceReview } from '../models/ResourceReview.js';
import { authOptional, authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get(
  '/',
  authOptional,
  [
    query('type').optional().isString(),
    query('cost').optional().isString(),
    query('availability').optional().isString(),
    query('language').optional().isString(),
    query('q').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const filter = { isCrisis: false };
      if (req.query.type) filter.type = req.query.type;
      if (req.query.cost) filter.cost = req.query.cost;
      if (req.query.availability) filter.availability = req.query.availability;
      if (req.query.language) filter.languages = req.query.language;
      if (req.query.q && req.query.q.trim()) {
        filter.$or = [
          { name: new RegExp(req.query.q.trim(), 'i') },
          { description: new RegExp(req.query.q.trim(), 'i') },
        ];
      }
      const resources = await Resource.find(filter).sort({ name: 1 }).lean();
      res.json(resources);
    } catch (e) {
      next(e);
    }
  }
);

router.get('/saved', authRequired, async (req, res, next) => {
  try {
    const saved = await SavedResource.find({ userId: req.user._id })
      .populate('resourceId')
      .lean();
    const list = saved.map((s) => s.resourceId).filter(Boolean);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/:id',
  authOptional,
  [param('id').isString().trim().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      const resource = await Resource.findById(req.params.id).lean();
      if (!resource) return res.status(404).json({ error: 'Resource not found' });
      const reviews = await ResourceReview.find({ resourceId: req.params.id }).lean();
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
          : null;
      res.json({ ...resource, averageRating: avgRating, reviewCount: reviews.length });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/:id/save',
  authRequired,
  [param('id').isString().trim().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      const resource = await Resource.findById(req.params.id);
      if (!resource) return res.status(404).json({ error: 'Resource not found' });
      if (resource.isCrisis) return res.status(400).json({ error: 'Crisis resources cannot be saved here' });
      await SavedResource.findOneAndUpdate(
        { userId: req.user._id, resourceId: req.params.id },
        { userId: req.user._id, resourceId: req.params.id },
        { upsert: true }
      );
      res.json({ saved: true });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/:id/review',
  authRequired,
  [
    param('id').isMongoId(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const resource = await Resource.findById(req.params.id);
      if (!resource) return res.status(404).json({ error: 'Resource not found' });
      if (resource.isCrisis) return res.status(400).json({ error: 'Crisis resources cannot be rated' });
      const rating = parseInt(req.body.rating, 10) || 0;
      if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
      await ResourceReview.findOneAndUpdate(
        { userId: req.user._id, resourceId: req.params.id },
        { rating, comment: (req.body.comment || '').trim() },
        { upsert: true }
      );
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
