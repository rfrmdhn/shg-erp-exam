import request from 'supertest';
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

describe('POST /api/auth/login', () => {
  it('returns user (no password fields) and sets httpOnly cookie for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ username: 'admin', role: 'admin' });
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('passwordHash');
    // Token must be in a Set-Cookie header, not in the response body.
    expect(res.body.token).toBeUndefined();
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/^token=/);
    expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/i);
  });

  it('rejects an invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.user).toBeUndefined();
  });

  it('rejects an unknown user with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'nobody', password: 'admin123' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('returns 500 when the DB throws unexpectedly', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('DB connection lost'));
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.status).toBe(500);
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the auth cookie and returns 204', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({ username: 'admin', password: 'admin123' });

    const res = await agent.post('/api/v1/auth/logout');
    expect(res.status).toBe(204);
    // Cookie should be cleared (expired).
    const cookie = res.headers['set-cookie']?.[0] ?? '';
    expect(cookie).toMatch(/token=;/);
  });
});
