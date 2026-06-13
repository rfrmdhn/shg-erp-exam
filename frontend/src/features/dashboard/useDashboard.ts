import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUnitStore } from '@/stores/unit';

export function useDashboard() {
  const router = useRouter();
  const authStore = useAuthStore();
  const unitStore = useUnitStore();

  const activeUnitName = computed(
    () => unitStore.units.find((u) => u.id === unitStore.selectedUnitId)?.name || '—'
  );

  function goVendors() {
    router.push({ name: 'vendors' });
  }

  return { authStore, unitStore, activeUnitName, goVendors };
}
