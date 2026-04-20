import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'fallback-dev-secret-min-32-characters-long');

export function authOptional(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    req.user = null;
    return next();
  }
  if (!JWT_SECRET) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    User.findById(decoded.userId)
      .then((user) => {
        req.user = user || null;
        next();
      })
      .catch(() => {
        req.user = null;
        next();
      });
  } catch {
    req.user = null;
    next();
  }
}

export function authRequired(req, res, next) {
  if (!JWT_SECRET) return res.status(500).json({ error: 'Server misconfiguration' });
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    User.findById(decoded.userId)
      .then((user) => {
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = user;
        next();
      })
      .catch((err) =>
        res.status(500).json({
          error: 'Auth failed',
          ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
        })
      );
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
