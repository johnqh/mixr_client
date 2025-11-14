/**
 * Equipment-related React hooks
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/MixrClient';
import type { EquipmentSubcategory } from '../types';

/**
 * Hook to get equipment subcategories
 */
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

/**
 * Hook to get equipment by subcategory
 */
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
