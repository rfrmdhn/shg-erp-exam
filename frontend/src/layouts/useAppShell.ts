import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUnitStore } from '@/stores/unit';

export function useAppShell() {
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const unitStore = useUnitStore();

  const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'Dashboard');
  const showBranchSelector = computed(() => route.name === 'vendors' || route.name === 'dashboard');

  const userInitial = computed(() =>
    (authStore.user?.name || 'U').charAt(0).toUpperCase()
  );

  onMounted(() => {
    if (unitStore.units.length === 0) {
      unitStore.fetchUnits();
    }
  });

  async function onLogout() {
    await authStore.logout();
    router.push({ name: 'login' });
  }

  return { authStore, unitStore, pageTitle, userInitial, showBranchSelector, onLogout };
}
