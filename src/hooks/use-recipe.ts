/**
 * Hook to fetch a single recipe by ID.
 *
 * Uses TanStack Query with a 10-minute stale time and integrates with
 * the Zustand recipe store for instant display via `placeholderData`.
 * If the recipe is already in the store (e.g., from `useRecipes`), it
 * is shown immediately while a background refetch updates the data.
 *
 * The query is disabled when `recipeId` is null or undefined.
 *
 * Query key: `['recipes', 'detail', recipeId]`
 *
 * @param client - MixrClient instance for API calls
 * @param useRecipeStore - Recipe store hook from createRecipeStore
 * @param recipeId - Recipe ID to fetch, or null/undefined to disable the query
 * @returns TanStack Query result with `Recipe` data
 *
 * @example
 * ```tsx
 * const { data: recipe, isLoading } = useRecipe(client, useRecipeStore, 42);
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { UseRecipeStore } from './use-recipe-store-type';
import { QUERY_KEYS } from './query-keys';

export function useRecipe(
  client: MixrClient,
  useRecipeStore: UseRecipeStore,
  recipeId: number | null | undefined
) {
  const { getRecipe, hasRecipe, setRecipe } = useRecipeStore();

  // Get placeholder data if available
  const placeholderData = recipeId && hasRecipe(recipeId) ? getRecipe(recipeId) : undefined;

  return useQuery({
    queryKey: QUERY_KEYS.recipes.detail(recipeId),
    queryFn: async () => {
      if (!recipeId) {
        throw new Error('Recipe ID is required');
      }

      const response = await client.getRecipeById(recipeId);
      const recipe = response.data;

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      // Update Zustand store with fetched recipe
      setRecipe(recipe);

      return recipe;
    },
    enabled: !!recipeId,
    // Return local data immediately if available
    ...(placeholderData ? { placeholderData } : {}),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
