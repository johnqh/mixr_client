/**
 * Hook to create (generate) a new recipe.
 *
 * Uses TanStack Query's `useMutation` to send a recipe generation request.
 * On success, the created recipe is:
 * 1. Stored in the Zustand recipe store for immediate local access
 * 2. Added to the TanStack Query cache under its detail key
 * 3. Triggers invalidation of recipe list queries to refetch
 *
 * @param client - MixrClient instance for API calls
 * @param useRecipeStore - Recipe store hook from createRecipeStore
 * @returns TanStack Mutation result with `Recipe` data and `mutate(request)` method
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateRecipe(client, useRecipeStore);
 * mutate({ equipment_ids: [1, 2], ingredient_ids: [3, 4], mood_id: 1 });
 * ```
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { GenerateRecipeRequest, Recipe } from '../types';
import type { UseRecipeStore } from './use-recipe-store-type';
import { QUERY_KEYS } from './query-keys';

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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipes.all });

      // Set the recipe data in the query cache
      queryClient.setQueryData(QUERY_KEYS.recipes.detail(recipe.id), recipe);
    },
  });
}
