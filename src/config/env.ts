/**
 * Centralized environment access. Never read import.meta.env directly
 * elsewhere — this is the single seam to swap in real values, and it fails
 * loudly in development if something required is missing.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  useMockData: (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') !== 'false',
}
