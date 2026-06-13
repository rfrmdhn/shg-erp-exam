import { ref, reactive, computed, onMounted } from 'vue';
import { useUnitStore } from '@/stores/unit';
import { required } from '@/utils/validators';
import { apiErrorMessage } from '@/utils/errors';
import type { Unit, VuetifyForm } from '@/types';

export function useBranchTable() {
  const unitStore = useUnitStore();

  const search = ref('');

  const filteredBranches = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return unitStore.units;
    return unitStore.units.filter((u) => u.name.toLowerCase().includes(q));
  });

  const dialog = ref(false);
  const saving = ref(false);
  const error = ref('');
  const formRef = ref<VuetifyForm | null>(null);
  const editingId = ref<number | null>(null);
  const form = reactive({ name: '' });

  const deleteDialog = ref(false);
  const deleting = ref(false);
  const deleteError = ref('');
  const toDelete = ref<Unit | null>(null);

  onMounted(async () => {
    if (unitStore.units.length === 0) await unitStore.fetchUnits();
    await unitStore.fetchVendorCounts();
  });

  function openDialog() {
    editingId.value = null;
    form.name = '';
    error.value = '';
    dialog.value = true;
  }

  function openEdit(item: Unit) {
    editingId.value = item.id;
    form.name = item.name;
    error.value = '';
    dialog.value = true;
  }

  async function onSave() {
    const valid = formRef.value ? (await formRef.value.validate()).valid : true;
    if (!valid) return;

    saving.value = true;
    error.value = '';
    try {
      if (editingId.value) {
        await unitStore.updateUnit(editingId.value, form.name);
      } else {
        await unitStore.createUnit(form.name);
        await unitStore.fetchVendorCounts();
      }
      dialog.value = false;
    } catch (e: unknown) {
      const action = editingId.value ? 'update' : 'create';
      error.value = apiErrorMessage(e, `Failed to ${action} branch`);
    } finally {
      saving.value = false;
    }
  }

  function askDelete(item: Unit) {
    toDelete.value = item;
    deleteError.value = '';
    deleteDialog.value = true;
  }

  async function onDelete() {
    if (!toDelete.value) return;
    deleting.value = true;
    deleteError.value = '';
    try {
      await unitStore.deleteUnit(toDelete.value.id);
      deleteDialog.value = false;
    } catch (e: unknown) {
      deleteError.value = apiErrorMessage(e, 'Failed to delete branch');
    } finally {
      deleting.value = false;
    }
  }

  return {
    unitStore,
    search,
    filteredBranches,
    dialog,
    saving,
    error,
    formRef,
    editingId,
    form,
    deleteDialog,
    deleting,
    deleteError,
    toDelete,
    required,
    openDialog,
    openEdit,
    onSave,
    askDelete,
    onDelete,
  };
}
