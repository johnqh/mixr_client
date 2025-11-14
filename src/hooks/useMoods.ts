/**
 * Mood-related React hooks
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/MixrClient';

/**
 * Hook to get all moods
 */
export function useMoods(client: MixrClient) {
  return useQuery({
    queryKey: ['moods', 'list'],
    queryFn: async () => {
      const response = await client.getMoods();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - moods rarely change
  });
}
