<template>
  <div class="dt-avatar" :style="size !== 40 ? { width: `${size}px`, height: `${size}px` } : undefined">
    <v-icon v-if="icon" :icon="icon" size="20" />
    <span v-else-if="initials">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import './AppAvatar.scss';

withDefaults(
  defineProps<{
    icon?: string;
    initials?: string;
    size?: number;
  }>(),
  { size: 40 }
);
</script>
