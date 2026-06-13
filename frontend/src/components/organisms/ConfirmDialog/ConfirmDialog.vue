<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-subtitle-1 font-weight-bold">{{ title }}</v-card-title>
      <v-divider />
      <v-card-text>
        <slot />
        <v-alert v-if="error" type="error" density="compact" class="mt-3">
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">{{ cancelLabel }}</v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          :loading="loading"
          @click="$emit('confirm')"
        >
          {{ confirmLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    loading?: boolean;
    error?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
    maxWidth?: string | number;
  }>(),
  {
    loading: false,
    error: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmColor: 'error',
    maxWidth: 440,
  }
);

defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
}>();
</script>
