import type { Request } from 'express';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UserPublic {
  id: number;
  username: string;
  name: string;
  role: UserRole;
}

export interface LoginResult {
  user: UserPublic;
  token: string;
}

export interface CreateVendorData {
  vendorId: string;
  name: string;
  address: string;
  unitId: number;
}

export interface UpdateVendorData {
  name: string;
  address: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
