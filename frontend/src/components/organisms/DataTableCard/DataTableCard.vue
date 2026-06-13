<template>
  <div class="dt-card">
    <div class="dt-card-header">
      <div class="dt-header-top">
        <div class="d-flex flex-column ga-1">
          <h3 class="dt-title">{{ title }}</h3>
          <span v-if="count !== undefined" class="dt-subcount">Showing {{ count }} results</span>
        </div>

        <slot name="actions" />
      </div>

      <SearchBar
        :model-value="modelValue"
        :placeholder="placeholder"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>

    <div class="dt-scroll">
      <slot />
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import './DataTableCard.scss';
import SearchBar from '@/components/molecules/SearchBar/SearchBar.vue';

withDefaults(
  defineProps<{
    title: string;
    count?: number;
    modelValue: string;
    placeholder?: string;
  }>(),
  { placeholder: 'Search...' }
);

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>
