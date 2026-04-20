import request from 'supertest';
import app from '../src/app.js';
import { detectCrisisKeywords } from '../src/services/crisisDetection.js';
import { CrisisContact } from '../src/models/CrisisContact.js';
import { Resource } from '../src/models/Resource.js';

describe('Crisis detection', () => {
  it('detects crisis keywords', () => {
    expect(detectCrisisKeywords('I want to kill myself')).toBe(true);
    expect(detectCrisisKeywords('suicide thoughts')).toBe(true);
    expect(detectCrisisKeywords('just had a good day')).toBe(false);
  });
});

describe('Crisis API', () => {
  beforeEach(async () => {
    await CrisisContact.deleteMany({});
    await Resource.deleteMany({});
  });

  it('GET /api/crisis/resources returns disclaimer and contacts', async () => {
    await CrisisContact.create({
      name: 'Local Hotline',
      phone: '111-111',
      order: 2,
    });
    await CrisisContact.create({
      name: 'National Lifeline',
      phone: '988',
      order: 1,
    });
    await Resource.create({
      name: 'Crisis Chat',
      type: 'hotline',
      cost: 'free',
      availability: '24/7',
      isCrisis: true,
    });
    await Resource.create({
      name: 'General Therapy',
      type: 'therapy',
      isCrisis: false,
    });

    const res = await request(app).get('/api/crisis/resources').expect(200);
    expect(res.body).toHaveProperty('disclaimer');
    expect(res.body).toHaveProperty('contacts');
    expect(Array.isArray(res.body.contacts)).toBe(true);
    expect(res.body.contacts.length).toBe(3);
    expect(res.body.contacts[0].name).toBe('National Lifeline');
    expect(res.body.contacts.some((c) => c.name === 'Crisis Chat')).toBe(true);
    expect(res.body.contacts.some((c) => c.name === 'General Therapy')).toBe(false);
  });
});
