import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { apiErrorMessage } from '@/utils/errors';

export function useLogin() {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  const username = ref('');
  const password = ref('');
  const loading = ref(false);
  const error = ref('');

  async function onSubmit() {
    error.value = '';
    loading.value = true;
    try {
      await authStore.login(username.value, password.value);
      const redirect = route.query.redirect as string | undefined;
      router.push(redirect ?? { name: 'dashboard' });
    } catch (e: unknown) {
      error.value = apiErrorMessage(e, 'Login failed');
    } finally {
      loading.value = false;
    }
  }

  return { username, password, loading, error, onSubmit };
}
