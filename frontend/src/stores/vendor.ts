import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import type { Vendor, VendorListResponse, NewVendorPayload } from '@/types';

export const useVendorStore = defineStore('vendor', () => {
  const vendors = ref<Vendor[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchVendors(unitId: number, p = page.value, l = limit.value): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<VendorListResponse>('/vendors', {
        params: { unitId, page: p, limit: l },
      });
      vendors.value = data.data;
      total.value = data.total;
      page.value = data.page;
      limit.value = data.limit;
    } catch (err) {
      error.value = 'Failed to load vendors';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createVendor(payload: NewVendorPayload): Promise<void> {
    await api.post('/vendors', payload);
    // Refresh the current unit's list after creating.
    await fetchVendors(payload.unitId, 1, limit.value);
  }

  async function updateVendor(id: number, payload: NewVendorPayload): Promise<void> {
    await api.put(`/vendors/${id}`, payload);
    await fetchVendors(payload.unitId, page.value, limit.value);
  }

  async function deleteVendor(id: number, unitId: number): Promise<void> {
    await api.delete(`/vendors/${id}`);
    // Stay on the current page unless it just emptied; clamp to page 1 if so.
    const nextPage = vendors.value.length === 1 ? 1 : page.value;
    await fetchVendors(unitId, nextPage, limit.value);
  }

  return {
    vendors,
    total,
    page,
    limit,
    loading,
    error,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
  };
});
