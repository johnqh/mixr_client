/**
 * Hook to fetch the current user's favorite recipes.
 *
 * Uses TanStack Query with a 5-minute stale time.
 * The query is disabled when `enabled` is false, allowing callers
 * to conditionally fetch only when the user is authenticated.
 *
 * Query key: `['user', 'favorites']`
 *
 * @param client - MixrClient instance for API calls
 * @param enabled - Whether to enable the query (default: true). Set to false when not authenticated.
 * @returns TanStack Query result with `Recipe[]` data
 *
 * @example
 * ```tsx
 * const { data: favorites } = useUserFavorites(client, isAuthenticated);
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import { QUERY_KEYS } from './query-keys';

export function useUserFavorites(client: MixrClient, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.user.favorites,
    queryFn: async () => {
      const response = await client.getUserFavorites();
      return response.data || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
