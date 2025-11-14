/**
 * Ingredient-related React hooks
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/MixrClient';
import type { IngredientSubcategory } from '../types';

/**
 * Hook to get ingredient subcategories
 */
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

/**
 * Hook to get ingredients by subcategory
 */
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
