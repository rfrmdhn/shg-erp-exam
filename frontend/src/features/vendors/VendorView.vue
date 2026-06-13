<template>
  <DataTableCard
    title="List Vendor"
    :count="vendorStore.total"
    v-model="search"
    placeholder="Search vendor..."
  >
    <template #actions>
      <AppButton
        icon="mdi-plus"
        data-test="new-vendor-btn"
        :disabled="!unitStore.selectedUnitId"
        @click="openDialog"
      >
        Add Vendor
      </AppButton>
    </template>

    <table class="dt-table">
      <thead>
        <tr>
          <th class="col-vendor">Vendor</th>
          <th class="col-address">Address</th>
          <th class="dt-actions-col dt-text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredVendors" :key="item.id" class="dt-row">
          <td>
            <div class="d-flex align-center ga-3">
              <AppAvatar :initials="initials(item.name)" />
              <div class="d-flex flex-column">
                <span class="dt-member-name">{{ item.name }}</span>
                <span class="dt-member-sub">{{ item.vendorId }}</span>
              </div>
            </div>
          </td>
          <td class="dt-cell-text">{{ item.address }}</td>
          <td class="dt-actions-col">
            <div class="d-flex align-center justify-end ga-1">
              <AppIconButton
                icon="mdi-pencil-outline"
                title="Edit"
                data-test="edit-vendor-btn"
                @click="openEdit(item)"
              />
              <AppIconButton
                icon="mdi-trash-can-outline"
                variant="danger"
                title="Delete"
                data-test="delete-vendor-btn"
                @click="askDelete(item)"
              />
            </div>
          </td>
        </tr>

        <TableEmptyState v-if="!filteredVendors.length" message="No vendors found for this unit." />
      </tbody>
    </table>

    <template #footer>
      <TablePagination
        :page="vendorStore.page"
        :limit="perPage"
        :total="vendorStore.total"
        @update:page="goTo"
        @update:limit="onPerPageChange"
      />
    </template>
  </DataTableCard>

  <FormDialog
    v-model="dialog"
    :title="editingId ? 'Edit Vendor' : 'New Vendor'"
    :loading="saving"
    :max-width="480"
    data-test="new-vendor-dialog"
    @save="onSave"
  >
    <v-form ref="formRef" @submit.prevent="onSave">
      <p class="text-caption text-muted mb-3">
        Branch: <strong>{{ selectedBranchName }}</strong>
      </p>
      <p v-if="editingId" class="text-caption mb-3">
        Vendor ID: <strong>{{ editingVendorId }}</strong>
      </p>
      <v-text-field
        v-model="form.name"
        label="Vendor Name"
        :rules="[required]"
        data-test="field-name"
      />
      <v-text-field
        v-model="form.address"
        label="Address"
        :rules="[required]"
        data-test="field-address"
      />
      <v-alert v-if="error" type="error" density="compact" class="mt-1">
        {{ error }}
      </v-alert>
    </v-form>
  </FormDialog>

  <ConfirmDialog
    v-model="deleteDialog"
    title="Delete Vendor"
    confirm-label="Delete"
    :loading="deleting"
    :error="deleteError"
    :max-width="420"
    data-test="delete-vendor-dialog"
    @confirm="onDelete"
  >
    Delete <strong>{{ toDelete?.name }}</strong> ({{ toDelete?.vendorId }})? This cannot be undone.
  </ConfirmDialog>
</template>

<script setup lang="ts">
import './vendor.scss';
import { useVendorTable } from './useVendorTable';
import AppAvatar from '@/components/atoms/AppAvatar/AppAvatar.vue';
import AppButton from '@/components/atoms/AppButton/AppButton.vue';
import AppIconButton from '@/components/atoms/AppIconButton/AppIconButton.vue';
import TableEmptyState from '@/components/molecules/TableEmptyState/TableEmptyState.vue';
import TablePagination from '@/components/molecules/TablePagination/TablePagination.vue';
import DataTableCard from '@/components/organisms/DataTableCard/DataTableCard.vue';
import FormDialog from '@/components/organisms/FormDialog/FormDialog.vue';
import ConfirmDialog from '@/components/organisms/ConfirmDialog/ConfirmDialog.vue';

const {
  unitStore,
  vendorStore,
  selectedBranchName,
  search,
  perPage,
  filteredVendors,
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
  goTo,
  onPerPageChange,
  openDialog,
  openEdit,
  onSave,
  askDelete,
  onDelete,
} = useVendorTable();
</script>
