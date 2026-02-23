/**
 * Hook to fetch recipes created by the current authenticated user.
 *
 * Uses TanStack Query with a 5-minute stale time.
 * The query is disabled when `enabled` is false, allowing callers
 * to conditionally fetch only when the user is authenticated.
 *
 * Query key: `['user', 'recipes']`
 *
 * @param client - MixrClient instance for API calls
 * @param enabled - Whether to enable the query (default: true). Set to false when not authenticated.
 * @returns TanStack Query result with `Recipe[]` data
 *
 * @example
 * ```tsx
 * const { data: myRecipes } = useUserRecipes(client, isAuthenticated);
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import { QUERY_KEYS } from './query-keys';

export function useUserRecipes(client: MixrClient, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.user.recipes,
    queryFn: async () => {
      const response = await client.getUserRecipes();
      return response.data || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
