import { Router } from 'express';
import { CrisisContact } from '../models/CrisisContact.js';
import { Resource } from '../models/Resource.js';
import { authOptional } from '../middleware/auth.js';

const router = Router();

router.get('/resources', authOptional, async (req, res, next) => {
  try {
    const [contacts, resources] = await Promise.all([
      CrisisContact.find().sort({ order: 1 }).lean(),
      Resource.find({ isCrisis: true }).lean(),
    ]);
    res.json({
      disclaimer:
        'This app is not emergency services. If you or someone you know is in immediate danger, please call emergency services (e.g. 911 in the US) or a crisis hotline.',
      contacts: [...contacts, ...resources],
    });
  } catch (e) {
    next(e);
  }
});

export default router;
