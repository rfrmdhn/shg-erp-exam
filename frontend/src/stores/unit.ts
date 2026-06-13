import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import type { Unit, VendorListResponse } from '@/types';

export const useUnitStore = defineStore('unit', () => {
  const units = ref<Unit[]>([]);
  const selectedUnitId = ref<number | null>(null);
  const vendorCounts = ref<Record<number, number>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchUnits(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<Unit[]>('/units');
      units.value = data;
      // Default to the first unit if none selected yet.
      if (selectedUnitId.value === null && data.length > 0) {
        selectedUnitId.value = data[0].id;
      }
    } catch (err) {
      error.value = 'Failed to load branches';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Fetch the vendor count for every loaded unit (used by the Branch list view).
  async function fetchVendorCounts(): Promise<void> {
    const entries = await Promise.all(
      units.value.map(async (u) => {
        const { data } = await api.get<VendorListResponse>('/vendors', {
          params: { unitId: u.id, page: 1, limit: 1 },
        });
        return [u.id, data.total] as const;
      })
    );
    vendorCounts.value = Object.fromEntries(entries);
  }

  function setSelectedUnit(id: number): void {
    selectedUnitId.value = id;
  }

  async function createUnit(name: string): Promise<void> {
    await api.post('/units', { name });
    await fetchUnits();
  }

  async function updateUnit(id: number, name: string): Promise<void> {
    await api.put(`/units/${id}`, { name });
    await fetchUnits();
  }

  async function deleteUnit(id: number): Promise<void> {
    await api.delete(`/units/${id}`);
    // If the deleted branch was selected, fall back to the first remaining one.
    if (selectedUnitId.value === id) {
      selectedUnitId.value = null;
    }
    await fetchUnits();
  }

  return {
    units,
    selectedUnitId,
    vendorCounts,
    loading,
    error,
    fetchUnits,
    fetchVendorCounts,
    setSelectedUnit,
    createUnit,
    updateUnit,
    deleteUnit,
  };
});
