import { Router } from 'express';
import { body, query } from 'express-validator';
import { MoodEntry } from '../models/MoodEntry.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { detectCrisisKeywords, getCrisisPayload } from '../services/crisisDetection.js';
import { CrisisContact } from '../models/CrisisContact.js';
import { Resource } from '../models/Resource.js';

const router = Router();
const VALID_TAGS = ['sleep', 'exercise', 'social', 'work', 'weather', 'food', 'other'];

router.post(
  '/',
  authRequired,
  [
    body('moodScore').isInt({ min: 1, max: 10 }),
    body('notes').optional().isString().trim(),
    body('tags').optional().isArray(),
    body('tags.*').optional().isIn(VALID_TAGS),
  ],
  validate,
  async (req, res, next) => {
    try {
      const notes = (req.body.notes || '').trim();
      if (detectCrisisKeywords(notes)) {
        const crisisContacts = await CrisisContact.find().sort({ order: 1 });
        const crisisResources = await Resource.find({ isCrisis: true }).lean();
        const payload = getCrisisPayload([...crisisContacts, ...crisisResources]);
        return res.status(200).json({ ...payload, moodSaved: false });
      }
      const entry = await MoodEntry.create({
        userId: req.user._id,
        moodScore: req.body.moodScore,
        notes: notes || undefined,
        tags: Array.isArray(req.body.tags) ? req.body.tags.filter((t) => VALID_TAGS.includes(t)) : [],
      });
      res.status(201).json(entry);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/',
  authRequired,
  [
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const filter = { userId: req.user._id };
      if (req.query.from) filter.createdAt = filter.createdAt || {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) {
        filter.createdAt = filter.createdAt || {};
        filter.createdAt.$lte = new Date(req.query.to);
      }
      const entries = await MoodEntry.find(filter).sort({ createdAt: -1 }).lean();
      res.json(entries);
    } catch (e) {
      next(e);
    }
  }
);

router.get('/analytics', authRequired, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const entries = await MoodEntry.find({ userId }).sort({ createdAt: 1 }).lean();
    const byWeek = {};
    const byMonth = {};
    entries.forEach((e) => {
      const d = new Date(e.createdAt);
      const weekKey = `${d.getFullYear()}-W${String(Math.ceil(d.getDate() / 7)).padStart(2, '0')}`;
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!byWeek[weekKey]) byWeek[weekKey] = [];
      byWeek[weekKey].push(e.moodScore);
      if (!byMonth[monthKey]) byMonth[monthKey] = [];
      byMonth[monthKey].push(e.moodScore);
    });
    const weekly = Object.entries(byWeek).map(([k, v]) => ({
      period: k,
      average: v.reduce((a, b) => a + b, 0) / v.length,
      count: v.length,
    }));
    const monthly = Object.entries(byMonth).map(([k, v]) => ({
      period: k,
      average: v.reduce((a, b) => a + b, 0) / v.length,
      count: v.length,
    }));
    const tagScores = {};
    entries.forEach((e) => {
      (e.tags || []).forEach((tag) => {
        if (!tagScores[tag]) tagScores[tag] = [];
        tagScores[tag].push(e.moodScore);
      });
    });
    const insights = [];
    Object.entries(tagScores).forEach(([tag, scores]) => {
      if (scores.length >= 3) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        insights.push({ tag, averageMood: Math.round(avg * 10) / 10, sampleSize: scores.length });
      }
    });
    res.json({ weekly, monthly, insights, totalEntries: entries.length });
  } catch (e) {
    next(e);
  }
});

router.get('/export/csv', authRequired, async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.from) filter.createdAt = { ...filter.createdAt, $gte: new Date(req.query.from) };
    if (req.query.to) filter.createdAt = { ...filter.createdAt, $lte: new Date(req.query.to) };
    const entries = await MoodEntry.find(filter).sort({ createdAt: -1 }).lean();
    const header = 'Date,Mood,Notes,Tags\n';
    const rows = entries.map(
      (e) =>
        `${new Date(e.createdAt).toISOString()},${e.moodScore},"${(e.notes || '').replace(/"/g, '""')}","${(e.tags || []).join(',')}"`
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=mood-history.csv');
    res.send(header + rows.join('\n'));
  } catch (e) {
    next(e);
  }
});

export default router;
