<template>
  <span class="dt-badge dt-badge-count">{{ count }}</span>
</template>

<script setup lang="ts">
import './AppBadge.scss';

defineProps<{
  count: string | number;
}>();
</script>
