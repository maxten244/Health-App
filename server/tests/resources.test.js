import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Resource } from '../src/models/Resource.js';
import { SavedResource } from '../src/models/SavedResource.js';

let authCookie;

async function login() {
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'resuser@example.com', password: 'password123' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'resuser@example.com', password: 'password123' });
  authCookie = res.headers['set-cookie'];
}

describe('Resources API', () => {
  let resourceId;
  let secondResourceId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Resource.deleteMany({});
    await SavedResource.deleteMany({});
    await login();
    const r = await Resource.create({
      name: 'Test Resource',
      type: 'therapy',
      cost: 'free',
      availability: '24/7',
      description: 'A free therapy resource',
      languages: ['en'],
      isCrisis: false,
    });
    resourceId = r._id.toString();
    const r2 = await Resource.create({
      name: 'Paid Campus Support',
      type: 'campus',
      cost: 'paid',
      availability: 'weekdays',
      description: 'Campus counseling center',
      languages: ['en', 'es'],
      isCrisis: false,
    });
    secondResourceId = r2._id.toString();
  });

  it('GET /api/resources returns list', async () => {
    const res = await request(app).get('/api/resources').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((r) => r.name === 'Test Resource')).toBe(true);
  });

  it('GET /api/resources applies type/cost/availability/language filters', async () => {
    const res = await request(app)
      .get('/api/resources?type=therapy&cost=free&availability=24/7&language=en')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Test Resource');
  });

  it('GET /api/resources applies q search', async () => {
    const res = await request(app).get('/api/resources?q=campus').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((r) => r.name === 'Paid Campus Support')).toBe(true);
  });

  it('GET /api/resources/:id returns one resource', async () => {
    const res = await request(app).get(`/api/resources/${resourceId}`).expect(200);
    expect(res.body.name).toBe('Test Resource');
    expect(Object.keys(res.body).sort()).toEqual(
      expect.arrayContaining(['averageRating', 'reviewCount', 'name', 'type', 'cost', 'availability'].sort())
    );
  });

  it('GET /api/resources/:id returns 404 for unknown id', async () => {
    await request(app).get('/api/resources/not-a-real-id').expect(404);
  });

  it('POST /api/resources/:id/save requires auth', async () => {
    await request(app).post(`/api/resources/${resourceId}/save`).expect(401);
  });

  it('POST /api/resources/:id/save saves when authenticated', async () => {
    await request(app)
      .post(`/api/resources/${resourceId}/save`)
      .set('Cookie', authCookie)
      .expect(200);
    const res = await request(app).get('/api/resources/saved').set('Cookie', authCookie).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Test Resource');
  });

  it('POST /api/resources/:id/save returns 404 for unknown id', async () => {
    await request(app).post('/api/resources/not-a-real-id/save').set('Cookie', authCookie).expect(404);
  });

  it('GET /api/resources/saved returns only saved resources', async () => {
    await request(app).post(`/api/resources/${resourceId}/save`).set('Cookie', authCookie).expect(200);
    await request(app).post(`/api/resources/${secondResourceId}/save`).set('Cookie', authCookie).expect(200);
    const res = await request(app).get('/api/resources/saved').set('Cookie', authCookie).expect(200);
    expect(res.body.length).toBe(2);
    const names = res.body.map((r) => r.name).sort();
    expect(names).toEqual(['Paid Campus Support', 'Test Resource']);
  });
});
