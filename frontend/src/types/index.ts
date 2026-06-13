export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface Unit {
  id: number;
  name: string;
}

export interface Vendor {
  id: number;
  vendorId: string;
  name: string;
  address: string;
  unitId: number;
}

export interface VendorListResponse {
  data: Vendor[];
  total: number;
  page: number;
  limit: number;
}

export interface NewVendorPayload {
  name: string;
  address: string;
  unitId: number;
}

export interface VuetifyForm {
  validate: () => Promise<{ valid: boolean }>;
}
