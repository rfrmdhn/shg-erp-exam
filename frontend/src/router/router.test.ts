import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import router from './index';
import { useAuthStore } from '@/stores/auth';

describe('router guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('redirects unauthenticated users to /login', async () => {
    await router.push('/vendors');
    await router.isReady();
    expect(router.currentRoute.value.name).toBe('login');
  });

  it('preserves the intended route as a redirect query param', async () => {
    await router.push('/vendors');
    await router.isReady();
    expect(router.currentRoute.value.query.redirect).toBe('/vendors');
  });

  it('allows authenticated users to reach protected routes', async () => {
    const auth = useAuthStore();
    auth.user = { id: 1, username: 'admin', name: 'Administrator', role: 'admin' };

    await router.push('/dashboard');
    await router.isReady();
    expect(router.currentRoute.value.name).toBe('dashboard');
  });

  it('redirects authenticated users away from /login to dashboard', async () => {
    const auth = useAuthStore();
    auth.user = { id: 1, username: 'admin', name: 'Administrator', role: 'admin' };

    await router.push('/login');
    await router.isReady();
    expect(router.currentRoute.value.name).toBe('dashboard');
  });
});
