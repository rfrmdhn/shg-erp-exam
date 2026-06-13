import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api, TOKEN_KEY, USER_KEY } from '@/services/api';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // Token lives in an httpOnly cookie — JS never reads it directly.
  // We track only the user object for UI state; isAuthenticated is derived from it.
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null') as User | null
  );
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  async function login(username: string, password: string): Promise<void> {
    error.value = null;
    try {
      const { data } = await api.post<{ user: User }>('/auth/login', { username, password });
      user.value = data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      throw err;
    }
  }

  async function logout(): Promise<void> {
    await api.post('/auth/logout').catch(() => {});  // clear httpOnly cookie server-side
    user.value = null;
    error.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { user, error, isAuthenticated, login, logout };
});
