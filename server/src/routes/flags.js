import { Router } from 'express';
import { body } from 'express-validator';
import { FlagReport } from '../models/FlagReport.js';
import { authOptional } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  authOptional,
  [
    body('targetType').isIn(['post', 'response']),
    body('targetId').isString().trim().notEmpty(),
    body('reason').isString().trim().isLength({ min: 1, max: 500 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const report = await FlagReport.create({
        targetType: req.body.targetType,
        targetId: req.body.targetId,
        reason: req.body.reason.trim(),
      });
      res.status(201).json({ id: report._id, status: report.status });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
