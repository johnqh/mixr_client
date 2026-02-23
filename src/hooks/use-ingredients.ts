/**
 * Hook to fetch ingredients with optional subcategory filtering.
 *
 * Uses TanStack Query with a 30-minute stale time, meaning data is
 * considered fresh for 30 minutes before a background refetch is triggered.
 *
 * Query key: `['ingredients', 'list', subcategory?]`
 *
 * @param client - MixrClient instance for API calls
 * @param subcategory - Optional subcategory filter (e.g., 'spirit', 'fruit')
 * @returns TanStack Query result with `Ingredient[]` data
 *
 * @example
 * ```tsx
 * const { data: ingredients, isLoading } = useIngredients(client);
 * const { data: spirits } = useIngredients(client, 'spirit');
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { IngredientSubcategory } from '../types';
import { QUERY_KEYS } from './query-keys';

export function useIngredients(client: MixrClient, subcategory?: IngredientSubcategory) {
  return useQuery({
    queryKey: QUERY_KEYS.ingredients.list(subcategory),
    queryFn: async () => {
      const response = await client.getIngredients(subcategory);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
