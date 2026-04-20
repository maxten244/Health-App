import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('registers a new user and sets cookie', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(201);
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body).toHaveProperty('token');
      expect(Object.keys(res.body).sort()).toEqual(['token', 'user']);
      expect(Object.keys(res.body.user).sort()).toEqual(['email', 'id']);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('rejects short password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'short' })
        .expect(400);
    });

    it('rejects duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dup@example.com', password: 'password123' })
        .expect(201);
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dup@example.com', password: 'password456' })
        .expect(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'login@example.com', password: 'password123' });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password123' })
        .expect(200);
      expect(res.body.user.email).toBe('login@example.com');
      expect(Object.keys(res.body).sort()).toEqual(['token', 'user']);
      expect(Object.keys(res.body.user).sort()).toEqual(['email', 'id']);
    });

    it('rejects invalid password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'login2@example.com', password: 'password123' });
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'login2@example.com', password: 'wrong' })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns user when authenticated', async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ email: 'me@example.com', password: 'password123' });
      const cookie = reg.headers['set-cookie'];
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookie)
        .expect(200);
      expect(res.body.user.email).toBe('me@example.com');
      expect(Object.keys(res.body)).toEqual(['user']);
      expect(Object.keys(res.body.user).sort()).toEqual(['email', 'id', 'privacySettings']);
    });

    it('returns 401 when not authenticated', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });
  });

  describe('PATCH /api/auth/me', () => {
    it('updates privacy settings when authenticated', async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ email: 'privacy@example.com', password: 'password123' });
      const cookie = reg.headers['set-cookie'];

      const res = await request(app)
        .patch('/api/auth/me')
        .set('Cookie', cookie)
        .send({
          privacySettings: {
            anonymityInCommunity: false,
            visibility: 'self',
          },
        })
        .expect(200);

      expect(res.body.user.privacySettings.anonymityInCommunity).toBe(false);
      expect(res.body.user.privacySettings.visibility).toBe('self');
      expect(Object.keys(res.body)).toEqual(['user']);
      expect(Object.keys(res.body.user).sort()).toEqual(['email', 'id', 'privacySettings']);
    });

    it('returns 401 when unauthenticated', async () => {
      await request(app)
        .patch('/api/auth/me')
        .send({ privacySettings: { visibility: 'self' } })
        .expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('clears cookie', async () => {
      const res = await request(app).post('/api/auth/logout').expect(200);
      expect(res.body.message).toBe('Logged out');
      expect(Object.keys(res.body)).toEqual(['message']);
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });
});
