/**
 * Hook to fetch equipment items with optional subcategory filtering.
 *
 * Uses TanStack Query with a 30-minute stale time, meaning data is
 * considered fresh for 30 minutes before a background refetch is triggered.
 *
 * Query key: `['equipment', 'list', subcategory?]`
 *
 * @param client - MixrClient instance for API calls
 * @param subcategory - Optional subcategory filter (e.g., 'essential', 'glassware')
 * @returns TanStack Query result with `Equipment[]` data
 *
 * @example
 * ```tsx
 * const { data: equipment, isLoading } = useEquipments(client);
 * const { data: glassware } = useEquipments(client, 'glassware');
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { EquipmentSubcategory } from '../types';
import { QUERY_KEYS } from './query-keys';

export function useEquipments(client: MixrClient, subcategory?: EquipmentSubcategory) {
  return useQuery({
    queryKey: QUERY_KEYS.equipment.list(subcategory),
    queryFn: async () => {
      const response = await client.getEquipment(subcategory);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
