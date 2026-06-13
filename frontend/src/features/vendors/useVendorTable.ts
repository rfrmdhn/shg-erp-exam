import { ref, reactive, computed, watch } from 'vue';
import { useUnitStore } from '@/stores/unit';
import { useVendorStore } from '@/stores/vendor';
import { useTablePagination } from '@/components/molecules/TablePagination/useTablePagination';
import { required } from '@/utils/validators';
import { initials } from '@/utils/strings';
import { apiErrorMessage } from '@/utils/errors';
import type { Vendor, VuetifyForm } from '@/types';

export function useVendorTable() {
  const unitStore = useUnitStore();
  const vendorStore = useVendorStore();

  const selectedBranchName = computed(
    () => unitStore.units.find((u) => u.id === unitStore.selectedUnitId)?.name ?? '—'
  );

  const { totalPages, pageNumbers } = useTablePagination(vendorStore);

  const search = ref('');
  const perPageOptions = [10, 25, 50, 100];
  const perPage = ref(vendorStore.limit);

  // Client-side filter over the current page.
  const filteredVendors = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return vendorStore.vendors;
    return vendorStore.vendors.filter(
      (v) =>
        v.vendorId.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q)
    );
  });

  const dialog = ref(false);
  const saving = ref(false);
  const error = ref('');
  const formRef = ref<VuetifyForm | null>(null);
  const editingId = ref<number | null>(null);
  const editingVendorId = ref('');
  const form = reactive({ name: '', address: '' });

  const deleteDialog = ref(false);
  const deleting = ref(false);
  const deleteError = ref('');
  const toDelete = ref<Vendor | null>(null);

  function load(page = vendorStore.page, limit = vendorStore.limit) {
    if (unitStore.selectedUnitId) {
      vendorStore.fetchVendors(unitStore.selectedUnitId, page, limit);
    }
  }

  // Refetch whenever the selected unit changes.
  watch(
    () => unitStore.selectedUnitId,
    () => load(1, vendorStore.limit)
  );

  function goTo(page: number) {
    if (page < 1 || page > totalPages.value || page === vendorStore.page) return;
    load(page, perPage.value);
  }

  function onPerPageChange() {
    load(1, perPage.value);
  }

  function openDialog() {
    editingId.value = null;
    editingVendorId.value = '';
    form.name = '';
    form.address = '';
    error.value = '';
    dialog.value = true;
  }

  function openEdit(item: Vendor) {
    editingId.value = item.id;
    editingVendorId.value = item.vendorId;
    form.name = item.name;
    form.address = item.address;
    error.value = '';
    dialog.value = true;
  }

  async function onSave() {
    const valid = formRef.value ? (await formRef.value.validate()).valid : true;
    if (!valid || !unitStore.selectedUnitId) return;

    saving.value = true;
    error.value = '';
    try {
      const payload = {
        name: form.name,
        address: form.address,
        unitId: unitStore.selectedUnitId,
      };
      if (editingId.value) {
        await vendorStore.updateVendor(editingId.value, payload);
      } else {
        await vendorStore.createVendor(payload);
      }
      dialog.value = false;
    } catch (e: unknown) {
      const action = editingId.value ? 'update' : 'create';
      error.value = apiErrorMessage(e, `Failed to ${action} vendor`);
    } finally {
      saving.value = false;
    }
  }

  function askDelete(item: Vendor) {
    toDelete.value = item;
    deleteError.value = '';
    deleteDialog.value = true;
  }

  async function onDelete() {
    if (!toDelete.value || !unitStore.selectedUnitId) return;
    deleting.value = true;
    deleteError.value = '';
    try {
      await vendorStore.deleteVendor(toDelete.value.id, unitStore.selectedUnitId);
      deleteDialog.value = false;
    } catch (e: unknown) {
      deleteError.value = apiErrorMessage(e, 'Failed to delete vendor');
    } finally {
      deleting.value = false;
    }
  }

  return {
    unitStore,
    vendorStore,
    selectedBranchName,
    search,
    perPageOptions,
    perPage,
    filteredVendors,
    totalPages,
    pageNumbers,
    dialog,
    saving,
    error,
    formRef,
    editingId,
    editingVendorId,
    form,
    deleteDialog,
    deleting,
    deleteError,
    toDelete,
    required,
    initials,
    load,
    goTo,
    onPerPageChange,
    openDialog,
    openEdit,
    onSave,
    askDelete,
    onDelete,
  };
}
