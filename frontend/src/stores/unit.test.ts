import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUnitStore } from './unit';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  TOKEN_KEY: 'siloam_token',
  USER_KEY: 'siloam_user',
}));

const mockUnits = [
  { id: 1, name: 'Siloam Lippo Village' },
  { id: 2, name: 'Siloam Bogor' },
];

describe('unit store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetchUnits populates the list and selects the first unit by default', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockUnits });

    const store = useUnitStore();
    await store.fetchUnits();

    expect(api.get).toHaveBeenCalledWith('/units');
    expect(store.units).toHaveLength(2);
    expect(store.selectedUnitId).toBe(1);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('does not overwrite selectedUnitId when one is already set', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockUnits });

    const store = useUnitStore();
    store.setSelectedUnit(2);
    await store.fetchUnits();

    expect(store.selectedUnitId).toBe(2);
  });

  it('sets error state and re-throws when fetchUnits fails', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const store = useUnitStore();
    await store.fetchUnits().catch(() => {});

    expect(store.error).toBe('Failed to load branches');
    expect(store.loading).toBe(false);
  });

  it('createUnit posts to /units then refetches', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [...mockUnits, { id: 3, name: 'New Branch' }],
    });

    const store = useUnitStore();
    await store.createUnit('New Branch');

    expect(api.post).toHaveBeenCalledWith('/units', { name: 'New Branch' });
    expect(store.units).toHaveLength(3);
  });

  it('updateUnit puts to /units/:id then refetches', async () => {
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [{ id: 1, name: 'Renamed' }, mockUnits[1]],
    });

    const store = useUnitStore();
    await store.updateUnit(1, 'Renamed');

    expect(api.put).toHaveBeenCalledWith('/units/1', { name: 'Renamed' });
    expect(store.units[0].name).toBe('Renamed');
  });

  it('deleteUnit auto-selects the first remaining unit when the selected unit is deleted', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockUnits[1]] });

    const store = useUnitStore();
    store.setSelectedUnit(1);
    await store.deleteUnit(1);

    expect(api.delete).toHaveBeenCalledWith('/units/1');
    // fetchUnits auto-selects first returned unit when selection was cleared
    expect(store.selectedUnitId).toBe(2);
    expect(store.units).toHaveLength(1);
  });

  it('deleteUnit keeps selectedUnitId when a different unit is deleted', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockUnits[0]] });

    const store = useUnitStore();
    store.setSelectedUnit(1);
    await store.deleteUnit(2);

    expect(store.selectedUnitId).toBe(1);
  });

  it('fetchVendorCounts queries each unit for its vendor total', async () => {
    (api.get as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ data: mockUnits })
      .mockResolvedValueOnce({ data: { data: [], total: 5, page: 1, limit: 1 } })
      .mockResolvedValueOnce({ data: { data: [], total: 2, page: 1, limit: 1 } });

    const store = useUnitStore();
    await store.fetchUnits();
    await store.fetchVendorCounts();

    expect(store.vendorCounts[1]).toBe(5);
    expect(store.vendorCounts[2]).toBe(2);
  });
});
