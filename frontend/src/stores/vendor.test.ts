import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useVendorStore } from './vendor';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: { get: vi.fn(), post: vi.fn() },
  TOKEN_KEY: 'siloam_token',
}));

describe('vendor store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetchVendors populates list, total and pagination', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        data: [
          { id: 1, vendorId: 'Vendor001', name: 'Vendor 001', address: 'Tangerang', unitId: 1 },
        ],
        total: 1,
        page: 1,
        limit: 10,
      },
    });

    const store = useVendorStore();
    await store.fetchVendors(1, 1, 10);

    expect(api.get).toHaveBeenCalledWith('/vendors', {
      params: { unitId: 1, page: 1, limit: 10 },
    });
    expect(store.vendors).toHaveLength(1);
    expect(store.total).toBe(1);
    expect(store.vendors[0].vendorId).toBe('Vendor001');
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('createVendor posts then refetches the unit list', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: {} });
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: [], total: 0, page: 1, limit: 10 },
    });

    const store = useVendorStore();
    await store.createVendor({
      name: 'New',
      address: 'Jakarta',
      unitId: 2,
    });

    expect(api.post).toHaveBeenCalledWith('/vendors', {
      name: 'New',
      address: 'Jakarta',
      unitId: 2,
    });
    // refetch happens for the same unit
    expect(api.get).toHaveBeenCalledWith('/vendors', {
      params: { unitId: 2, page: 1, limit: 10 },
    });
  });

  it('sets error state and resets loading when fetchVendors fails', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const store = useVendorStore();
    await store.fetchVendors(1).catch(() => {});

    expect(store.loading).toBe(false);
    expect(store.error).toBe('Failed to load vendors');
  });

  it('re-throws on createVendor failure so the view can show an error', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockRejectedValue(
      Object.assign(new Error('Bad request'), { response: { status: 400, data: { message: 'dup' } } })
    );

    const store = useVendorStore();
    await expect(
      store.createVendor({ name: 'X', address: 'X', unitId: 1 })
    ).rejects.toBeTruthy();
  });
});
