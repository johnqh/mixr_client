/**
 * Hook to fetch the current user's preferences (equipment and ingredient selections).
 *
 * Uses TanStack Query with a 10-minute stale time.
 * The query is disabled when `enabled` is false, allowing callers
 * to conditionally fetch only when the user is authenticated.
 *
 * Query key: `['user', 'preferences']`
 *
 * @param client - MixrClient instance for API calls
 * @param enabled - Whether to enable the query (default: true). Set to false when not authenticated.
 * @returns TanStack Query result with `UserPreferences` data
 *
 * @example
 * ```tsx
 * const { data: prefs } = useUserPreferences(client, isAuthenticated);
 * // prefs?.equipment_ids, prefs?.ingredient_ids
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import { QUERY_KEYS } from './query-keys';

export function useUserPreferences(client: MixrClient, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.user.preferences,
    queryFn: async () => {
      const response = await client.getUserPreferences();
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
