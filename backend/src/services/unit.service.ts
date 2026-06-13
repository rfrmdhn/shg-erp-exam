import { Unit, Vendor } from '../models';
import { AppError } from '../errors/AppError';
import { ERR_BRANCH_NOT_FOUND, ERR_BRANCH_DUPLICATE } from '../constants';

export async function listUnits(): Promise<Unit[]> {
  return Unit.findAll({ order: [['id', 'ASC']] });
}

export async function createUnit(name: string): Promise<Unit> {
  const trimmed = name.trim();
  const existing = await Unit.findOne({ where: { name: trimmed } });
  if (existing) {
    throw new AppError(ERR_BRANCH_DUPLICATE, 400);
  }
  return Unit.create({ name: trimmed });
}

export async function updateUnit(id: number, name: string): Promise<Unit> {
  const trimmed = name.trim();
  const unit = await Unit.findByPk(id);
  if (!unit) {
    throw new AppError(ERR_BRANCH_NOT_FOUND, 404);
  }

  const clash = await Unit.findOne({ where: { name: trimmed } });
  if (clash && clash.id !== id) {
    throw new AppError(ERR_BRANCH_DUPLICATE, 400);
  }

  unit.name = trimmed;
  await unit.save();
  return unit;
}

export async function deleteUnit(id: number): Promise<void> {
  const unit = await Unit.findByPk(id);
  if (!unit) {
    throw new AppError(ERR_BRANCH_NOT_FOUND, 404);
  }

  const vendorCount = await Vendor.count({ where: { unitId: id } });
  if (vendorCount > 0) {
    throw new AppError(
      `Cannot delete a branch with ${vendorCount} vendor(s). Remove its vendors first.`,
      400
    );
  }

  await unit.destroy();
}
