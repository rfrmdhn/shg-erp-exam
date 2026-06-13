<template>
  <DataTableCard
    title="List Branch"
    :count="unitStore.units.length"
    v-model="search"
    placeholder="Search branch..."
  >
    <template #actions>
      <AppButton icon="mdi-plus" data-test="new-branch-btn" @click="openDialog">
        Add Branch
      </AppButton>
    </template>

    <table class="dt-table">
      <thead>
        <tr>
          <th class="col-branch">Branch</th>
          <th class="col-count dt-text-right">Vendors</th>
          <th class="dt-actions-col dt-text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredBranches" :key="item.id" class="dt-row">
          <td>
            <div class="d-flex align-center ga-3">
              <AppAvatar icon="mdi-hospital-building" />
              <div class="d-flex flex-column">
                <span class="dt-member-name">{{ item.name }}</span>
                <span class="dt-member-sub">Branch #{{ item.id }}</span>
              </div>
            </div>
          </td>
          <td class="dt-text-right">
            <AppBadge :count="unitStore.vendorCounts[item.id] ?? '–'" />
          </td>
          <td class="dt-actions-col">
            <div class="d-flex align-center justify-end ga-1">
              <AppIconButton
                icon="mdi-pencil-outline"
                title="Edit"
                data-test="edit-branch-btn"
                @click="openEdit(item)"
              />
              <AppIconButton
                icon="mdi-trash-can-outline"
                variant="danger"
                title="Delete"
                data-test="delete-branch-btn"
                @click="askDelete(item)"
              />
            </div>
          </td>
        </tr>

        <TableEmptyState v-if="!filteredBranches.length" message="No branches found." />
      </tbody>
    </table>
  </DataTableCard>

  <FormDialog
    v-model="dialog"
    :title="editingId ? 'Edit Branch' : 'New Branch'"
    :loading="saving"
    data-test="branch-dialog"
    @save="onSave"
  >
    <v-form ref="formRef" @submit.prevent="onSave">
      <v-text-field
        v-model="form.name"
        label="Branch Name"
        :rules="[required]"
        data-test="field-branch-name"
      />
      <v-alert v-if="error" type="error" density="compact" class="mt-1">
        {{ error }}
      </v-alert>
    </v-form>
  </FormDialog>

  <ConfirmDialog
    v-model="deleteDialog"
    title="Delete Branch"
    confirm-label="Delete"
    :loading="deleting"
    :error="deleteError"
    data-test="delete-branch-dialog"
    @confirm="onDelete"
  >
    Delete branch <strong>{{ toDelete?.name }}</strong>? This cannot be undone.
  </ConfirmDialog>
</template>

<script setup lang="ts">
import './branch.scss';
import { useBranchTable } from './useBranchTable';
import AppAvatar from '@/components/atoms/AppAvatar/AppAvatar.vue';
import AppBadge from '@/components/atoms/AppBadge/AppBadge.vue';
import AppButton from '@/components/atoms/AppButton/AppButton.vue';
import AppIconButton from '@/components/atoms/AppIconButton/AppIconButton.vue';
import TableEmptyState from '@/components/molecules/TableEmptyState/TableEmptyState.vue';
import DataTableCard from '@/components/organisms/DataTableCard/DataTableCard.vue';
import FormDialog from '@/components/organisms/FormDialog/FormDialog.vue';
import ConfirmDialog from '@/components/organisms/ConfirmDialog/ConfirmDialog.vue';

const {
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
} = useBranchTable();
</script>
