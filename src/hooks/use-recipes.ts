/**
 * Hook to get recipes with pagination
 * Integrates with Zustand store for local caching
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { UseRecipeStore } from './use-recipe-store-type';

/**
 * Hook to get recipes with pagination
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
