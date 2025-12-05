/**
 * Hook to get a single recipe by ID
 * Returns local data immediately if available, refetches in background
 */

import { useQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { UseRecipeStore } from './use-recipe-store-type';

/**
 * Hook to get a single recipe by ID
 *
 * @param client - MixrClient instance for API calls
 * @param useRecipeStore - Recipe store hook from createRecipeStore
 * @param recipeId - Recipe ID to fetch
 */
export function useRecipe(
  client: MixrClient,
  useRecipeStore: UseRecipeStore,
  recipeId: number | null | undefined
) {
  const { getRecipe, hasRecipe, setRecipe } = useRecipeStore();

  // Get placeholder data if available
  const placeholderData = recipeId && hasRecipe(recipeId) ? getRecipe(recipeId) : undefined;

  return useQuery({
    queryKey: ['recipes', 'detail', recipeId],
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
