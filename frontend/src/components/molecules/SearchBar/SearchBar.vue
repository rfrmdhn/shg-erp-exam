<template>
  <div class="dt-header-tools">
    <div class="dt-input">
      <v-icon icon="mdi-magnify" size="16" class="dt-input-icon" />
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <AppButton
      v-if="modelValue"
      variant="light"
      icon="mdi-restart"
      @click="$emit('update:modelValue', '')"
    >
      Reset
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import './SearchBar.scss';
import AppButton from '@/components/atoms/AppButton/AppButton.vue';

withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
  }>(),
  { placeholder: 'Search...' }
);

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>
