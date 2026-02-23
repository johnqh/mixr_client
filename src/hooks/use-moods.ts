/**
 * Hook to fetch all moods.
 *
 * Uses TanStack Query with a 1-hour stale time since moods rarely change
 * and can be aggressively cached.
 *
 * Query key: `['moods', 'list']`
 *
 * @param client - MixrClient instance for API calls
 * @returns TanStack Query result with `Mood[]` data
 *
 * @example
 * ```tsx
 * const { data: moods, isLoading } = useMoods(client);
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import { QUERY_KEYS } from './query-keys';

export function useMoods(client: MixrClient) {
  return useQuery({
    queryKey: QUERY_KEYS.moods.list,
    queryFn: async () => {
      const response = await client.getMoods();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - moods rarely change
  });
}
