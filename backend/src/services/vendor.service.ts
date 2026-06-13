import { Vendor } from '../models';
import { AppError } from '../errors/AppError';
import type { CreateVendorData, PaginatedResult, UpdateVendorData } from '../types';
import { ERR_VENDOR_NOT_FOUND } from '../constants';

export type { CreateVendorData, UpdateVendorData };

async function generateVendorId(unitId: number): Promise<string> {
  const vendors = await Vendor.findAll({ where: { unitId }, attributes: ['vendorId'] });
  let maxSeq = 0;
  for (const v of vendors) {
    const match = v.vendorId.match(/^VND-(\d+)$/);
    if (match) {
      maxSeq = Math.max(maxSeq, parseInt(match[1], 10));
    }
  }
  return `VND-${String(maxSeq + 1).padStart(4, '0')}`;
}

export async function listVendors(unitId: number, page: number, limit: number): Promise<PaginatedResult<Vendor>> {
  const { rows, count } = await Vendor.findAndCountAll({
    where: { unitId },
    order: [['id', 'ASC']],
    limit,
    offset: (page - 1) * limit,
  });
  return { data: rows, total: count, page, limit };
}

export async function createVendor(data: CreateVendorData): Promise<Vendor> {
  const vendorId = await generateVendorId(data.unitId);
  const existing = await Vendor.findOne({ where: { vendorId, unitId: data.unitId } });
  if (existing) {
    throw new AppError('vendorId already exists for this unit', 400);
  }
  return Vendor.create({ ...data, vendorId });
}

export async function updateVendor(id: number, data: UpdateVendorData): Promise<Vendor> {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) {
    throw new AppError(ERR_VENDOR_NOT_FOUND, 404);
  }

  vendor.name = data.name;
  vendor.address = data.address;
  await vendor.save();
  return vendor;
}

export async function deleteVendor(id: number): Promise<void> {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) {
    throw new AppError(ERR_VENDOR_NOT_FOUND, 404);
  }
  await vendor.destroy();
}
