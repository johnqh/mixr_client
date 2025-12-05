/**
 * Hook to create a new recipe
 * Updates Zustand store with the created recipe
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { GenerateRecipeRequest, Recipe } from '../types';
import type { UseRecipeStore } from './use-recipe-store-type';

/**
 * Hook to create a new recipe
 *
 * @param client - MixrClient instance for API calls
 * @param useRecipeStore - Recipe store hook from createRecipeStore
 */
export function useCreateRecipe(client: MixrClient, useRecipeStore: UseRecipeStore) {
  const { setRecipe } = useRecipeStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GenerateRecipeRequest) => {
      const response = await client.generateRecipe(request);
      const recipe = response.data;

      if (!recipe) {
        throw new Error('Failed to create recipe');
      }

      return recipe;
    },
    onSuccess: (recipe: Recipe) => {
      // Update Zustand store with the new recipe
      setRecipe(recipe);

      // Invalidate recipe list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['recipes', 'list'] });

      // Set the recipe data in the query cache
      queryClient.setQueryData(['recipes', 'detail', recipe.id], recipe);
    },
  });
}
