<template>
  <v-card
    class="app-card pa-5"
    :class="{ 'card-clickable': clickable }"
    @click="clickable ? $emit('click') : undefined"
  >
    <div class="d-flex align-center ga-4">
      <div class="stat-icon" :class="`stat-icon--${iconVariant}`">
        <v-icon :icon="icon" size="22" />
      </div>
      <div>
        <div
          class="font-weight-bold"
          :class="[
            typeof value === 'number' ? 'text-h5 stat-value' : 'text-h6 stat-value-sm',
            clickable ? 'text-primary' : '',
          ]"
        >
          {{ value }}
        </div>
        <div class="text-body-2 text-secondary">{{ label }}</div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import './StatCard.scss';

withDefaults(
  defineProps<{
    icon: string;
    value: string | number;
    label: string;
    iconVariant?: 'primary' | 'info';
    clickable?: boolean;
  }>(),
  { iconVariant: 'primary', clickable: false }
);

defineEmits<{ click: [] }>();
</script>
