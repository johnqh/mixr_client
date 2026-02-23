/**
 * Hook to fetch equipment subcategories.
 *
 * Uses TanStack Query with a 1-hour stale time since subcategories
 * rarely change and can be aggressively cached.
 *
 * Query key: `['equipment', 'subcategories']`
 *
 * @param client - MixrClient instance for API calls
 * @returns TanStack Query result with `string[]` data (subcategory names)
 *
 * @example
 * ```tsx
 * const { data: subcategories } = useEquipmentSubcategories(client);
 * // subcategories: ['essential', 'glassware', 'garnish', 'advanced']
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import { QUERY_KEYS } from './query-keys';

export function useEquipmentSubcategories(client: MixrClient) {
  return useQuery({
    queryKey: QUERY_KEYS.equipment.subcategories,
    queryFn: async () => {
      const response = await client.getEquipmentSubcategories();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - subcategories rarely change
  });
}
