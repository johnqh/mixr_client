/**
 * Hook to get equipment subcategories
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';

export function useEquipmentSubcategories(client: MixrClient) {
  return useQuery({
    queryKey: ['equipment', 'subcategories'],
    queryFn: async () => {
      const response = await client.getEquipmentSubcategories();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - subcategories rarely change
  });
}
