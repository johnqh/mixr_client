/**
 * Hook to get ingredients by subcategory
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { IngredientSubcategory } from '../types';

export function useIngredients(client: MixrClient, subcategory?: IngredientSubcategory) {
  return useQuery({
    queryKey: ['ingredients', 'list', subcategory],
    queryFn: async () => {
      const response = await client.getIngredients(subcategory);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
