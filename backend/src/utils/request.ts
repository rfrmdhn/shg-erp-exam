import { Request } from 'express';
import { AppError } from '../errors/AppError';
import { PaginationParams } from '../types';
import { ERR_INVALID_ID } from '../constants';

export function parseId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(ERR_INVALID_ID, 400);
  }
  return id;
}

export function parsePagination(
  req: Request,
  defaults: PaginationParams = { page: 1, limit: 10 }
): PaginationParams {
  return {
    page: Math.max(1, Number(req.query.page) || defaults.page),
    limit: Math.max(1, Number(req.query.limit) || defaults.limit),
  };
}

export function toStr(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function toNum(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? n : undefined;
}
