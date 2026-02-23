/**
 * Hook to fetch ingredient subcategories.
 *
 * Uses TanStack Query with a 1-hour stale time since subcategories
 * rarely change and can be aggressively cached.
 *
 * Query key: `['ingredients', 'subcategories']`
 *
 * @param client - MixrClient instance for API calls
 * @returns TanStack Query result with `string[]` data (subcategory names)
 *
 * @example
 * ```tsx
 * const { data: subcategories } = useIngredientSubcategories(client);
 * // subcategories: ['spirit', 'wine', 'other_alcohol', 'fruit', 'spice', 'other']
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import { QUERY_KEYS } from './query-keys';

export function useIngredientSubcategories(client: MixrClient) {
  return useQuery({
    queryKey: QUERY_KEYS.ingredients.subcategories,
    queryFn: async () => {
      const response = await client.getIngredientSubcategories();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - subcategories rarely change
  });
}
