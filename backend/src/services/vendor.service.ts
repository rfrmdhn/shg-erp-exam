import { Vendor } from '../models';
import { AppError } from '../errors/AppError';
import type { CreateVendorData, PaginatedResult, UpdateVendorData } from '../types';
import { ERR_VENDOR_NOT_FOUND } from '../constants';

export type { CreateVendorData, UpdateVendorData };

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
  const existing = await Vendor.findOne({ where: { vendorId: data.vendorId, unitId: data.unitId } });
  if (existing) {
    throw new AppError('Vendor ID already exists for this unit', 409);
  }
  return Vendor.create(data);
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
