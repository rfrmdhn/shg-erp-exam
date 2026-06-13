import { computed } from 'vue';

export function useTablePagination(props: { page: number; limit: number; total: number }) {
  const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.limit)));

  const pageNumbers = computed(() => {
    const total = totalPages.value;
    const current = props.page;
    const span = 5;
    let start = Math.max(1, current - Math.floor(span / 2));
    const end = Math.min(total, start + span - 1);
    start = Math.max(1, end - span + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  return { totalPages, pageNumbers };
}
