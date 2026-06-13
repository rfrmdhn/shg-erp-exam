<template>
  <div>
    <!-- Sidebar -->
    <v-navigation-drawer permanent color="surface" width="260" border>
      <div class="d-flex align-center px-5 sidebar-logo">
        <div class="logo-badge-sm mr-2">
          <v-icon icon="mdi-hospital-box" size="20" color="white" />
        </div>
        <div class="text-body-1 font-weight-bold brand-name">
          Siloam
        </div>
      </div>
      <v-divider />

      <v-list nav class="pt-3">
        <v-list-item
          class="sb-item"
          :to="{ name: 'dashboard' }"
          prepend-icon="mdi-view-dashboard-outline"
          title="Dashboard"
          value="dashboard"
        />

        <div class="sb-heading">Master Data</div>

        <v-list-item
          class="sb-item"
          :to="{ name: 'branches' }"
          prepend-icon="mdi-hospital-building"
          title="Branch"
          value="branch"
        />
        <v-list-item
          class="sb-item"
          :to="{ name: 'vendors' }"
          prepend-icon="mdi-account-box-multiple-outline"
          title="Vendor"
          value="vendor"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Topbar -->
    <v-app-bar flat color="surface" border height="64">
      <v-app-bar-title class="text-body-1 font-weight-bold">
        {{ pageTitle }}
      </v-app-bar-title>
      <v-spacer />

      <div v-if="showBranchSelector" class="branch-select mr-3">
        <v-select
          :model-value="unitStore.selectedUnitId"
          :items="unitStore.units"
          item-title="name"
          item-value="id"
          label="Branch"
          density="compact"
          hide-details
          data-test="unit-select"
          @update:model-value="unitStore.setSelectedUnit"
        />
      </div>

      <!-- User avatar + menu -->
      <v-menu offset="10">
        <template #activator="{ props }">
          <div class="avatar-badge mr-2" v-bind="props">
            {{ userInitial }}
          </div>
        </template>
        <v-card min-width="240" class="app-card pa-0">
          <div class="d-flex align-center ga-3 pa-3">
            <div class="avatar-badge">{{ userInitial }}</div>
            <div>
              <div class="text-body-2 font-weight-bold">
                {{ authStore.user?.name || 'User' }}
              </div>
              <div class="text-caption text-muted text-capitalize">
                {{ authStore.user?.role || '' }}
              </div>
            </div>
          </div>
          <v-divider />
          <div class="pa-3">
            <v-btn
              block
              variant="outlined"
              color="default"
              prepend-icon="mdi-logout"
              data-test="logout-btn"
              @click="onLogout"
            >
              Log out
            </v-btn>
          </div>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Content -->
    <v-main class="bg-background">
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import './app-shell.scss';
import { useAppShell } from './useAppShell';

const { authStore, unitStore, pageTitle, userInitial, showBranchSelector, onLogout } = useAppShell();
</script>
