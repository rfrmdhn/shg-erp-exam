export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err !== null && typeof err === 'object' && 'response' in err) {
    const { response } = err as { response?: { data?: { message?: string } } };
    return response?.data?.message ?? fallback;
  }
  return fallback;
}
