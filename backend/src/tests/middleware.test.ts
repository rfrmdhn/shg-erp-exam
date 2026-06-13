import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp } from '../app';
import { sequelize, User } from '../models';
import { resetAndSeed } from './helpers';

const app = createApp();

beforeEach(async () => {
  await resetAndSeed();
});

afterAll(async () => {
  await sequelize.close();
});

describe('requireRole (via POST /api/units)', () => {
  it('allows admin to create a unit', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({ username: 'admin', password: 'admin123' });
    const res = await agent.post('/api/v1/units').send({ name: 'New Branch' });
    expect(res.status).toBe(201);
  });

  it('returns 403 when a non-admin user tries to mutate units', async () => {
    await User.create({
      username: 'viewer',
      passwordHash: await bcrypt.hash('viewer123', 10),
      name: 'Viewer',
      role: 'user',
    });

    const viewerAgent = request.agent(app);
    await viewerAgent.post('/api/v1/auth/login').send({ username: 'viewer', password: 'viewer123' });

    const res = await viewerAgent.post('/api/v1/units').send({ name: 'Should Fail' });
    expect(res.status).toBe(403);
  });
});

describe('authMiddleware (via GET /api/units)', () => {
  it('rejects requests with no credentials', async () => {
    const res = await request(app).get('/api/v1/units');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token in Authorization header', async () => {
    const res = await request(app)
      .get('/api/v1/units')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('allows a valid httpOnly cookie (primary auth path)', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({ username: 'admin', password: 'admin123' });

    const res = await agent.get('/api/v1/units');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('rejects an invalid token in cookie', async () => {
    const res = await request(app)
      .get('/api/v1/units')
      .set('Cookie', 'token=not-a-real-token');
    expect(res.status).toBe(401);
  });
});
