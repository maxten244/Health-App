import request from 'supertest';
import app from '../src/app.js';
import { FlagReport } from '../src/models/FlagReport.js';

describe('Flags API', () => {
  beforeEach(async () => {
    await FlagReport.deleteMany({});
  });

  it('POST /api/flags creates report', async () => {
    const res = await request(app)
      .post('/api/flags')
      .send({
        targetType: 'post',
        targetId: '507f1f77bcf86cd799439011',
        reason: 'Spam content',
      })
      .expect(201);
    expect(Object.keys(res.body).sort()).toEqual(['id', 'status']);
    expect(res.body.status).toBe('pending');
  });

  it('rejects invalid targetType', async () => {
    await request(app)
      .post('/api/flags')
      .send({
        targetType: 'invalid',
        targetId: '507f1f77bcf86cd799439011',
        reason: 'Test',
      })
      .expect(400);
  });

  it('rejects missing reason', async () => {
    await request(app)
      .post('/api/flags')
      .send({
        targetType: 'post',
        targetId: '507f1f77bcf86cd799439011',
      })
      .expect(400);
  });

  it('rejects overly long reason', async () => {
    await request(app)
      .post('/api/flags')
      .send({
        targetType: 'response',
        targetId: '507f1f77bcf86cd799439012',
        reason: 'a'.repeat(501),
      })
      .expect(400);
  });
});
