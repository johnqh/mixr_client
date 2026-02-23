/**
 * Hooks to add or remove a recipe from the current user's favorites.
 *
 * Both hooks use TanStack Query's `useMutation`. On success, they
 * invalidate the user favorites query to refetch the latest data.
 *
 * @example
 * ```tsx
 * const { mutate: addFav } = useAddFavorite(client);
 * const { mutate: removeFav } = useRemoveFavorite(client);
 *
 * addFav({ recipe_id: 42 });
 * removeFav(42);
 * ```
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { AddFavoriteRequest } from '../types';
import { QUERY_KEYS } from './query-keys';

/**
 * Hook to add a recipe to the current user's favorites.
 *
 * @param client - MixrClient instance for API calls
 * @returns TanStack Mutation result with `mutate(request)` method
 */
export function useAddFavorite(client: MixrClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AddFavoriteRequest) => {
      return client.addFavorite(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.favorites });
    },
  });
}

/**
 * Hook to remove a recipe from the current user's favorites.
 *
 * @param client - MixrClient instance for API calls
 * @returns TanStack Mutation result with `mutate(recipeId)` method
 */
export function useRemoveFavorite(client: MixrClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipeId: number) => {
      return client.removeFavorite(recipeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.favorites });
    },
  });
}
