import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: { post: vi.fn() },
  TOKEN_KEY: 'siloam_token',
  USER_KEY: 'siloam_user',
}));

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts unauthenticated when localStorage is empty', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(store.error).toBeNull();
  });

  it('login stores user, persists to localStorage, and authenticates', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        user: { id: 1, username: 'admin', name: 'Administrator', role: 'admin' },
      },
    });

    const store = useAuthStore();
    await store.login('admin', 'admin123');

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      username: 'admin',
      password: 'admin123',
    });
    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.username).toBe('admin');
    expect(store.error).toBeNull();
    expect(JSON.parse(localStorage.getItem('siloam_user') ?? 'null')?.username).toBe('admin');
  });

  it('logout clears user, calls logout endpoint, and removes storage', async () => {
    (api.post as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        data: { user: { id: 1, username: 'a', name: 'A', role: 'admin' } },
      })
      .mockResolvedValueOnce({}); // logout endpoint

    const store = useAuthStore();
    await store.login('a', 'b');
    await store.logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('siloam_user')).toBeNull();
  });

  it('sets error state and re-throws when login fails', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockRejectedValue(
      Object.assign(new Error('Request failed'), { response: { status: 401 } })
    );

    const store = useAuthStore();
    await expect(store.login('admin', 'wrong')).rejects.toBeTruthy();
    expect(store.error).toBeTruthy();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });

  it('clears error on a successful login after a failed attempt', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('fail'));
    const store = useAuthStore();
    await store.login('a', 'b').catch(() => {});
    expect(store.error).toBeTruthy();

    (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { user: { id: 1, username: 'admin', name: 'A', role: 'admin' } },
    });
    await store.login('admin', 'admin123');
    expect(store.error).toBeNull();
    expect(store.isAuthenticated).toBe(true);
  });
});
