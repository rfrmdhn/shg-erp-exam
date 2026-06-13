<template>
  <tr>
    <td :colspan="colspan" class="dt-empty">
      <div class="d-flex flex-column align-center ga-2">
        <v-icon icon="mdi-emoticon-sad-outline" size="40" class="dt-empty-icon" />
        <span>{{ message }}</span>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import './TableEmptyState.scss';

withDefaults(
  defineProps<{
    message?: string;
    colspan?: number;
  }>(),
  { message: 'No results found.', colspan: 3 }
);
</script>
