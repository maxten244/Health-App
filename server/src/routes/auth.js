import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/User.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { getCookieOptions } from '../utils/cookie.js';

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'fallback-dev-secret-min-32-characters-long');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('displayName').optional().isString().isLength({ min: 1, max: 50 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      if (!JWT_SECRET) return res.status(500).json({ error: 'Server misconfiguration' });
      const { email, password, displayName } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ error: 'Email already registered' });
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ email, passwordHash, displayName: displayName || 'User' });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.cookie('token', token, getCookieOptions());
      res.status(201).json({ user: { id: user._id, email: user.email, displayName: user.displayName }, token });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      if (!JWT_SECRET) return res.status(500).json({ error: 'Server misconfiguration' });
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.cookie('token', token, getCookieOptions());
      res.json({ user: { id: user._id, email: user.email, displayName: user.displayName }, token });
    } catch (e) {
      next(e);
    }
  }
);

router.post('/logout', (req, res) => {
  const cookieOptions = getCookieOptions();
  res.clearCookie('token', {
    path: cookieOptions.path,
    domain: cookieOptions.domain,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    httpOnly: cookieOptions.httpOnly,
  });
  res.json({ message: 'Logged out' });
});

router.get('/me', authRequired, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
      privacySettings: req.user.privacySettings,
    },
  });
});

router.patch(
  '/me',
  authRequired,
  authLimiter,
  [
    body('privacySettings').optional().isObject(),
    body('privacySettings.anonymityInCommunity').optional().isBoolean(),
    body('privacySettings.dataSharingEnabled').optional().isBoolean(),
    body('privacySettings.visibility').optional().isIn(['private', 'self', 'trusted']),
    body('password').optional().isLength({ min: 8 }),
    body('displayName').optional().isString().isLength({ min: 1, max: 50 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      if (req.body.privacySettings) {
        req.user.privacySettings = { ...req.user.privacySettings, ...req.body.privacySettings };
      }
      if (req.body.password) {
        req.user.passwordHash = await bcrypt.hash(req.body.password, 12);
      }
      if (req.body.displayName) {
        req.user.displayName = req.body.displayName;
      }
      await req.user.save();
      res.json({
        user: {
          id: req.user._id,
          email: req.user.email,
          displayName: req.user.displayName,
          privacySettings: req.user.privacySettings,
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;