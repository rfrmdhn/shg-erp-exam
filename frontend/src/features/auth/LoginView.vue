<template>
  <div class="login-bg d-flex align-center justify-center">
    <v-card class="app-card pa-7" width="360" rounded="lg">
      <!-- Header -->
      <div class="text-center mb-5">
        <div class="logo-badge mx-auto mb-3">
          <v-icon icon="mdi-hospital-box" size="28" color="white" />
        </div>
        <h2 class="text-h6 font-weight-bold mb-1 sign-in-title">Sign in</h2>
        <p class="text-body-2 text-secondary ma-0">Siloam Vendor Management</p>
      </div>

      <v-alert
        v-if="error"
        type="error"
        density="compact"
        variant="tonal"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="onSubmit">
        <label class="field-label">Username</label>
        <v-text-field
          v-model="username"
          placeholder="Enter username"
          prepend-inner-icon="mdi-account-outline"
          data-test="username"
          autocomplete="username"
          class="mb-2"
        />

        <label class="field-label">Password</label>
        <v-text-field
          v-model="password"
          type="password"
          placeholder="Enter password"
          prepend-inner-icon="mdi-lock-outline"
          data-test="password"
          autocomplete="current-password"
          class="mb-4"
        />

        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          block
          size="large"
          :loading="loading"
          data-test="login-btn"
        >
          Sign In
        </v-btn>
      </v-form>

      <!-- <p class="text-center text-caption text-muted mt-5 mb-0">
        Demo: admin / admin123
      </p> -->
    </v-card>
  </div>
</template>

<script setup lang="ts">
import './login.scss';
import { useLogin } from './useLogin';

const { username, password, loading, error, onSubmit } = useLogin();
</script>
