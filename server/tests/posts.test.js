import request from 'supertest';
import app from '../src/app.js';
import { AnonymousPost } from '../src/models/AnonymousPost.js';
import { Response } from '../src/models/Response.js';
import { CrisisContact } from '../src/models/CrisisContact.js';
import { Resource } from '../src/models/Resource.js';

describe('Posts API', () => {
  beforeEach(async () => {
    await AnonymousPost.deleteMany({});
    await Response.deleteMany({});
    await CrisisContact.deleteMany({});
    await Resource.deleteMany({});
  });

  it('POST /api/posts creates anonymous post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ content: 'Feeling okay today.', categoryTags: ['general'] })
      .expect(201);
    expect(res.body.post).toHaveProperty('postId');
    expect(res.body.post.content).toBe('Feeling okay today.');
    expect(res.body).toHaveProperty('postOwnerToken');
  });

  it('GET /api/posts returns paginated list', async () => {
    await request(app).post('/api/posts').send({ content: 'Post one' });
    const res = await request(app).get('/api/posts?page=1&limit=10').expect(200);
    expect(Object.keys(res.body).sort()).toEqual(['limit', 'page', 'posts', 'total']);
    expect(res.body.posts.length).toBe(1);
  });

  it('GET /api/posts/:id returns post and responses', async () => {
    const create = await request(app).post('/api/posts').send({ content: 'Single post' });
    const postId = create.body.post.postId;
    const res = await request(app).get(`/api/posts/${postId}`).expect(200);
    expect(Object.keys(res.body).sort()).toEqual(['post', 'responses']);
    expect(res.body.post.content).toBe('Single post');
    expect(Array.isArray(res.body.responses)).toBe(true);
  });

  it('POST /api/posts/:id/responses adds response', async () => {
    const create = await request(app).post('/api/posts').send({ content: 'Need support' });
    const postId = create.body.post.postId;
    const res = await request(app)
      .post(`/api/posts/${postId}/responses`)
      .send({ content: 'Here for you.' })
      .expect(201);
    expect(res.body.response).toHaveProperty('content', 'Here for you.');
  });

  it('POST /api/posts returns crisis payload and does not create post on keyword detection', async () => {
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
      .post('/api/posts')
      .send({ content: 'I want to die and end it all' })
      .expect(200);

    expect(res.body.showCrisisModal).toBe(true);
    expect(res.body.postCreated).toBe(false);
    expect(Array.isArray(res.body.resources)).toBe(true);
    const postCount = await AnonymousPost.countDocuments({});
    expect(postCount).toBe(0);
  });

  it('POST /api/posts/:id/responses returns crisis payload and does not create response on keyword detection', async () => {
    await CrisisContact.create({
      name: '988 Lifeline',
      phone: '988',
      region: 'US',
      order: 1,
    });
    const create = await request(app).post('/api/posts').send({ content: 'Need support now' }).expect(201);

    const res = await request(app)
      .post(`/api/posts/${create.body.post.postId}/responses`)
      .send({ content: 'I am planning to end my life' })
      .expect(200);

    expect(res.body.showCrisisModal).toBe(true);
    expect(res.body.responseCreated).toBe(false);
    const responseCount = await Response.countDocuments({});
    expect(responseCount).toBe(0);
  });

  it('GET /api/posts/:id returns 404 when post does not exist', async () => {
    await request(app).get('/api/posts/non-existent-id').expect(404);
  });
});
