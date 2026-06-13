import request from 'supertest';
import { createApp } from '../app';
import { sequelize, Unit, Vendor } from '../models';
import { resetAndSeed } from './helpers';

const app = createApp();
const agent = request.agent(app);

let unit1Id: number;
let unit2Id: number;

beforeEach(async () => {
  const { unit1, unit2 } = await resetAndSeed();
  unit1Id = unit1.id;
  unit2Id = unit2.id;

  await agent.post('/api/v1/auth/login').send({ username: 'admin', password: 'admin123' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/units', () => {
  it('lists branches (units)', async () => {
    const res = await agent.get('/api/v1/units');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /api/units', () => {
  it('creates a branch', async () => {
    const res = await agent.post('/api/v1/units').send({ name: 'Siloam Makassar' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Siloam Makassar');
  });

  it('rejects a missing name', async () => {
    const res = await agent.post('/api/v1/units').send({});
    expect(res.status).toBe(400);
  });

  it('rejects a duplicate name', async () => {
    const res = await agent.post('/api/v1/units').send({ name: 'Siloam Lippo Village' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/units/:id', () => {
  it('updates a branch name', async () => {
    const res = await agent.put(`/api/v1/units/${unit2Id}`).send({ name: 'Siloam Bogor Renamed' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Siloam Bogor Renamed');
  });

  it('404s for a missing branch', async () => {
    const res = await agent.put('/api/v1/units/99999').send({ name: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/units/:id', () => {
  it('deletes an empty branch', async () => {
    // unit2 has no vendors
    const res = await agent.delete(`/api/v1/units/${unit2Id}`);
    expect(res.status).toBe(204);
    expect(await Unit.findByPk(unit2Id)).toBeNull();
  });

  it('blocks deleting a branch that still has vendors', async () => {
    // unit1 has the seeded Vendor001
    const res = await agent.delete(`/api/v1/units/${unit1Id}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/vendor/i);
    // still there
    expect(await Unit.findByPk(unit1Id)).not.toBeNull();
  });

  it('allows delete once vendors are removed', async () => {
    await Vendor.destroy({ where: { unitId: unit1Id } });
    const res = await agent.delete(`/api/v1/units/${unit1Id}`);
    expect(res.status).toBe(204);
  });
});
