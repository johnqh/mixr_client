/**
 * Hook to fetch recipes with infinite scroll pagination.
 *
 * Uses TanStack Query's `useInfiniteQuery` with a 5-minute stale time.
 * Integrates with the Zustand recipe store to provide local caching --
 * fetched recipes are automatically stored for fast access by `useRecipe`.
 *
 * Pagination is cursor-based using offset. When a page returns `limit` recipes,
 * `hasNextPage` is true and `fetchNextPage()` loads the next batch.
 *
 * Query key: `['recipes', 'list', limit]`
 *
 * @param client - MixrClient instance for API calls
 * @param useRecipeStore - Recipe store hook from createRecipeStore
 * @param limit - Number of recipes per page (default: 10)
 * @returns TanStack InfiniteQuery result with pages of `{ recipes, nextOffset }`
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage } = useRecipes(client, useRecipeStore, 10);
 * const allRecipes = data?.pages.flatMap(page => page.recipes) ?? [];
 * ```
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { UseRecipeStore } from './use-recipe-store-type';
import { QUERY_KEYS } from './query-keys';

export function useRecipes(client: MixrClient, useRecipeStore: UseRecipeStore, limit: number = 10) {
  const { setRecipes } = useRecipeStore();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.recipes.list(limit),
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
