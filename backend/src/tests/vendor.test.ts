import request from 'supertest';
import { createApp } from '../app';
import { sequelize, Vendor } from '../models';
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

describe('GET /api/vendors', () => {
  it('requires unitId', async () => {
    const res = await agent.get('/api/v1/vendors');
    expect(res.status).toBe(400);
  });

  it('lists vendors filtered by unit', async () => {
    // unit1 has the seeded Vendor001; unit2 has none
    const res1 = await agent.get(`/api/v1/vendors?unitId=${unit1Id}`);
    expect(res1.status).toBe(200);
    expect(res1.body.total).toBe(1);
    expect(res1.body.data[0].vendorId).toBe('Vendor001');

    const res2 = await agent.get(`/api/v1/vendors?unitId=${unit2Id}`);
    expect(res2.body.total).toBe(0);
    expect(res2.body.data).toHaveLength(0);
  });

  it('respects pagination', async () => {
    // add 14 more vendors to unit1 → 15 total
    for (let i = 2; i <= 15; i++) {
      await Vendor.create({
        vendorId: `Vendor${String(i).padStart(3, '0')}`,
        name: `Vendor ${i}`,
        address: 'Tangerang',
        unitId: unit1Id,
      });
    }

    const page1 = await agent.get(`/api/v1/vendors?unitId=${unit1Id}&page=1&limit=10`);
    expect(page1.body.total).toBe(15);
    expect(page1.body.data).toHaveLength(10);

    const page2 = await agent.get(`/api/v1/vendors?unitId=${unit1Id}&page=2&limit=10`);
    expect(page2.body.data).toHaveLength(5);
  });

  it('returns 500 when the DB throws unexpectedly', async () => {
    jest.spyOn(Vendor, 'findAndCountAll').mockRejectedValueOnce(new Error('DB connection lost'));
    const res = await agent.get(`/api/v1/vendors?unitId=${unit1Id}`);
    expect(res.status).toBe(500);
  });
});

describe('POST /api/vendors', () => {
  it('creates a vendor with a user-supplied ID', async () => {
    const res = await agent
      .post('/api/v1/vendors')
      .send({ vendorId: 'VND-0001', name: 'New Vendor', address: 'Jakarta', unitId: unit2Id });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      vendorId: 'VND-0001',
      name: 'New Vendor',
      address: 'Jakarta',
      unitId: unit2Id,
    });
  });

  it('rejects duplicate vendorId within the same unit with 409', async () => {
    const res = await agent
      .post('/api/v1/vendors')
      .send({ vendorId: 'Vendor001', name: 'Duplicate', address: 'Jakarta', unitId: unit1Id });

    expect(res.status).toBe(409);
  });

  it('allows the same vendorId in a different unit', async () => {
    const res = await agent
      .post('/api/v1/vendors')
      .send({ vendorId: 'Vendor001', name: 'Different Unit', address: 'Jakarta', unitId: unit2Id });

    expect(res.status).toBe(201);
    expect(res.body.vendorId).toBe('Vendor001');
  });

  it('rejects missing fields with 400', async () => {
    const res = await agent.post('/api/v1/vendors').send({ name: 'No address or id' });
    expect(res.status).toBe(400);
  });

  it('returns 500 when the DB throws unexpectedly on create', async () => {
    jest.spyOn(Vendor, 'findOne').mockRejectedValueOnce(new Error('DB connection lost'));
    const res = await agent
      .post('/api/v1/vendors')
      .send({ vendorId: 'X-001', name: 'X', address: 'X', unitId: unit1Id });
    expect(res.status).toBe(500);
  });
});

describe('PUT /api/vendors/:id', () => {
  it('updates name and address of an existing vendor', async () => {
    const v = await Vendor.create({
      vendorId: 'Vendor050',
      name: 'Old',
      address: 'Old Addr',
      unitId: unit1Id,
    });

    const res = await agent.put(`/api/v1/vendors/${v.id}`).send({
      name: 'Updated',
      address: 'New Addr',
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Updated', address: 'New Addr', vendorId: 'Vendor050' });
  });

  it('404s for a missing vendor', async () => {
    const res = await agent
      .put('/api/v1/vendors/99999')
      .send({ name: 'X', address: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/vendors/:id', () => {
  it('deletes a vendor', async () => {
    const v = await Vendor.create({
      vendorId: 'Vendor070',
      name: 'Seventy',
      address: 'A',
      unitId: unit1Id,
    });
    const res = await agent.delete(`/api/v1/vendors/${v.id}`);
    expect(res.status).toBe(204);
    expect(await Vendor.findByPk(v.id)).toBeNull();
  });

  it('404s for a missing vendor', async () => {
    const res = await agent.delete('/api/v1/vendors/99999');
    expect(res.status).toBe(404);
  });
});
