/**
 * Hook to get equipment by subcategory
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { EquipmentSubcategory } from '../types';

export function useEquipments(client: MixrClient, subcategory?: EquipmentSubcategory) {
  return useQuery({
    queryKey: ['equipment', 'list', subcategory],
    queryFn: async () => {
      const response = await client.getEquipment(subcategory);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
