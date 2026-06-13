<template>
  <div class="dt-card-footer">
    <div class="dt-perpage">
      <span>Rows per page</span>
      <select :value="limit" @change="onLimitChange">
        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div class="dt-pagination">
      <button
        type="button"
        class="dt-page-btn"
        :disabled="page <= 1"
        @click="$emit('update:page', page - 1)"
      >
        <v-icon icon="mdi-chevron-left" size="18" />
      </button>

      <button
        v-for="p in pageNumbers"
        :key="p"
        type="button"
        class="dt-page-btn"
        :class="{ 'dt-page-active': p === page }"
        @click="$emit('update:page', p)"
      >
        {{ p }}
      </button>

      <button
        type="button"
        class="dt-page-btn"
        :disabled="page >= totalPages"
        @click="$emit('update:page', page + 1)"
      >
        <v-icon icon="mdi-chevron-right" size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import './TablePagination.scss';
import { useTablePagination } from './useTablePagination';

const props = withDefaults(
  defineProps<{
    page: number;
    limit: number;
    total: number;
    perPageOptions?: number[];
  }>(),
  { perPageOptions: () => [10, 25, 50, 100] }
);

const emit = defineEmits<{
  'update:page': [page: number];
  'update:limit': [limit: number];
}>();

const { totalPages, pageNumbers } = useTablePagination(props);

function onLimitChange(event: Event) {
  emit('update:limit', Number((event.target as HTMLSelectElement).value));
}
</script>
