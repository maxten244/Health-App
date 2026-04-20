import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { MoodEntry } from '../src/models/MoodEntry.js';
import { CrisisContact } from '../src/models/CrisisContact.js';
import { Resource } from '../src/models/Resource.js';

let authCookie;

async function login() {
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'mooduser@example.com', password: 'password123' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'mooduser@example.com', password: 'password123' });
  authCookie = res.headers['set-cookie'];
}

describe('Moods API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await MoodEntry.deleteMany({});
    await CrisisContact.deleteMany({});
    await Resource.deleteMany({});
    await login();
  });

  it('POST /api/moods creates entry', async () => {
    const res = await request(app)
      .post('/api/moods')
      .set('Cookie', authCookie)
      .send({ moodScore: 7, notes: 'Good day', tags: ['exercise'] })
      .expect(201);
    expect(res.body.moodScore).toBe(7);
    expect(res.body.notes).toBe('Good day');
  });

  it('GET /api/moods returns user entries', async () => {
    await request(app)
      .post('/api/moods')
      .set('Cookie', authCookie)
      .send({ moodScore: 5 });
    const res = await request(app).get('/api/moods').set('Cookie', authCookie).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].moodScore).toBe(5);
  });

  it('GET /api/moods/analytics returns weekly and insights', async () => {
    await request(app).post('/api/moods').set('Cookie', authCookie).send({ moodScore: 6, tags: ['sleep'] });
    await request(app).post('/api/moods').set('Cookie', authCookie).send({ moodScore: 8, tags: ['sleep'] });
    const res = await request(app).get('/api/moods/analytics').set('Cookie', authCookie).expect(200);
    expect(res.body).toHaveProperty('weekly');
    expect(res.body).toHaveProperty('insights');
    expect(res.body).toHaveProperty('totalEntries');
  });

  it('POST /api/moods returns crisis payload and does not save entry when keywords detected', async () => {
    await CrisisContact.create({
      name: '988 Lifeline',
      phone: '988',
      region: 'US',
      order: 1,
    });
    await Resource.create({
      name: 'Crisis Text Line',
      type: 'hotline',
      cost: 'free',
      availability: '24/7',
      languages: ['en'],
      isCrisis: true,
    });

    const res = await request(app)
      .post('/api/moods')
      .set('Cookie', authCookie)
      .send({ moodScore: 3, notes: 'I want to die' })
      .expect(200);

    expect(res.body.showCrisisModal).toBe(true);
    expect(res.body.moodSaved).toBe(false);
    expect(Array.isArray(res.body.resources)).toBe(true);
    const count = await MoodEntry.countDocuments({});
    expect(count).toBe(0);
  });

  it('GET /api/moods/export/csv returns csv attachment', async () => {
    await request(app)
      .post('/api/moods')
      .set('Cookie', authCookie)
      .send({ moodScore: 8, notes: 'Feeling better', tags: ['sleep', 'exercise'] })
      .expect(201);

    const res = await request(app)
      .get('/api/moods/export/csv')
      .set('Cookie', authCookie)
      .expect(200);

    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.headers['content-disposition']).toContain('attachment; filename=mood-history.csv');
    expect(res.text).toContain('Date,Mood,Notes,Tags');
    expect(res.text).toContain('Feeling better');
  });

  it('GET /api/moods requires auth', async () => {
    await request(app).get('/api/moods').expect(401);
  });
});
