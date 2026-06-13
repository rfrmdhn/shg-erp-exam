import axios from 'axios';

export const TOKEN_KEY = 'siloam_token';
export const USER_KEY = 'siloam_user';

export const api = axios.create({
  baseURL: '/api/v1',
  // Send the httpOnly auth cookie on every cross-origin request.
  withCredentials: true,
});

// On 401 (expired / invalid session), clear stored user state and redirect to login.
// Skips the login endpoint itself to prevent a redirect loop on bad credentials.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosErr = error as { response?: { status?: number }; config?: { url?: string } };
    if (
      axiosErr.response?.status === 401 &&
      !axiosErr.config?.url?.includes('/auth/login')
    ) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      // Dynamic import avoids circular dependency (stores → api → router).
      void import('@/router').then(({ default: router }) => router.push('/login'));
    }
    return Promise.reject(error);
  }
);
