/**
 * Hook to get ingredient subcategories
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';

export function useIngredientSubcategories(client: MixrClient) {
  return useQuery({
    queryKey: ['ingredients', 'subcategories'],
    queryFn: async () => {
      const response = await client.getIngredientSubcategories();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - subcategories rarely change
  });
}
