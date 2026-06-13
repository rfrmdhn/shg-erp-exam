<template>
  <button
    type="button"
    class="dt-icon-btn"
    :class="{ 'dt-icon-btn-danger': variant === 'danger' }"
    :title="title"
    :disabled="disabled"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <v-icon :icon="icon" size="16" />
  </button>
</template>

<script setup lang="ts">
import './AppIconButton.scss';

withDefaults(
  defineProps<{
    icon: string;
    variant?: 'default' | 'danger';
    title?: string;
    disabled?: boolean;
  }>(),
  { variant: 'default', disabled: false }
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>
