<template>
  <button
    type="button"
    class="dt-btn"
    :class="`dt-btn-${variant}`"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <v-icon v-if="icon" :icon="icon" size="16" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import './AppButton.scss';

withDefaults(
  defineProps<{
    variant?: 'primary' | 'light';
    icon?: string;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  { variant: 'primary', loading: false, disabled: false }
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>
