/**
 * Recipe-related React hooks with Zustand integration
 * React Native compatible - accepts store from DI
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/MixrClient';
import type { GenerateRecipeRequest, Recipe } from '../types';
import type { RecipeStore } from '../stores/recipeStore';

/**
 * Type for the recipe store hook returned by createRecipeStore
 */
export type UseRecipeStore = () => RecipeStore;

/**
 * Hook to get recipes with pagination
 * Integrates with Zustand store for local caching
 *
 * @param client - MixrClient instance for API calls
 * @param useRecipeStore - Recipe store hook from createRecipeStore
 * @param limit - Number of recipes per page (default: 10)
 */
export function useRecipes(client: MixrClient, useRecipeStore: UseRecipeStore, limit: number = 10) {
  const { setRecipes } = useRecipeStore();

  return useInfiniteQuery({
    queryKey: ['recipes', 'list', limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await client.getRecipes({
        limit,
        offset: pageParam,
      });

      const recipes = response.data || [];

      // Update Zustand store with fetched recipes
      if (recipes.length > 0) {
        setRecipes(recipes);
      }

      return {
        recipes,
        nextOffset: recipes.length === limit ? pageParam + limit : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get a single recipe by ID
 * Returns local data immediately if available, refetches in background
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

/**
 * Hook to create a new recipe
 * Updates Zustand store with the created recipe
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
