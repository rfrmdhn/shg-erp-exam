<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">
        Welcome{{ authStore.user ? `, ${authStore.user.name}` : '' }}
      </h1>
      <p class="text-body-2 text-secondary ma-0">
        Siloam Vendor Management overview.
      </p>
    </div>

    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="4">
        <StatCard
          icon="mdi-hospital-building"
          :value="unitStore.units.length"
          label="Total Units"
          icon-variant="primary"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <StatCard
          icon="mdi-map-marker-outline"
          :value="activeUnitName"
          label="Active Unit"
          icon-variant="info"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <StatCard
          icon="mdi-account-box-multiple-outline"
          value="View Vendors"
          label="Manage the vendor list →"
          icon-variant="primary"
          clickable
          @click="goVendors"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from './useDashboard';
import StatCard from '@/components/molecules/StatCard/StatCard.vue';

const { authStore, unitStore, activeUnitName, goVendors } = useDashboard();
</script>
