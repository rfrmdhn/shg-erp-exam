import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types';
import { parseId, parsePagination } from '../utils/request';
import * as vendorService from '../services/vendor.service';
import type { VendorCreateBody, VendorUpdateBody, VendorQueryParams } from '../schemas/vendor.schema';

export async function listVendors(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const { unitId } = req.query as unknown as VendorQueryParams;
  const { page, limit } = parsePagination(req);

  try {
    const result = await vendorService.listVendors(unitId, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createVendor(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const { name, address, unitId } = req.body as VendorCreateBody;

  try {
    const vendor = await vendorService.createVendor({ name, address, unitId });
    res.status(201).json(vendor);
  } catch (err) {
    next(err);
  }
}

export async function updateVendor(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req);
    const { name, address } = req.body as VendorUpdateBody;
    const vendor = await vendorService.updateVendor(id, { name, address });
    res.json(vendor);
  } catch (err) {
    next(err);
  }
}

export async function deleteVendor(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req);
    await vendorService.deleteVendor(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
