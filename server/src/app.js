import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { generalLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/moods.js';
import postRoutes from './routes/posts.js';
import resourceRoutes from './routes/resources.js';
import flagRoutes from './routes/flags.js';
import crisisRoutes from './routes/crisis.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '500kb' }));
app.use(cookieParser());
app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/crisis', crisisRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
