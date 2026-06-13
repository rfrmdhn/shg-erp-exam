import bcrypt from 'bcryptjs';
import { sequelize, Unit, User, Vendor } from '../models';

/**
 * Reset the in-memory test DB and seed a known baseline:
 * - admin / admin123 user
 * - two units
 * - one vendor in unit 1
 */
export async function resetAndSeed() {
  await sequelize.sync({ force: true });

  await User.create({
    username: 'admin',
    passwordHash: await bcrypt.hash('admin123', 10),
    name: 'Administrator',
    role: 'admin',
  });

  const unit1 = await Unit.create({ name: 'Siloam Lippo Village' });
  const unit2 = await Unit.create({ name: 'Siloam Bogor' });

  await Vendor.create({
    vendorId: 'Vendor001',
    name: 'Vendor 001',
    address: 'Tangerang',
    unitId: unit1.id,
  });

  return { unit1, unit2 };
}
