/**
 * Hook to fetch the current authenticated user's profile.
 *
 * Uses TanStack Query with a 10-minute stale time.
 * The query is disabled when `enabled` is false, allowing callers
 * to conditionally fetch only when the user is authenticated.
 *
 * Query key: `['user', 'profile']`
 *
 * @param client - MixrClient instance for API calls
 * @param enabled - Whether to enable the query (default: true). Set to false when not authenticated.
 * @returns TanStack Query result with `User` data
 *
 * @example
 * ```tsx
 * const { data: user, isLoading } = useCurrentUser(client, isAuthenticated);
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import { QUERY_KEYS } from './query-keys';

export function useCurrentUser(client: MixrClient, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.user.profile,
    queryFn: async () => {
      const response = await client.getCurrentUser();
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
