/**
 * Hook to update the current user's preferences.
 *
 * Uses TanStack Query's `useMutation`. On success, invalidates the
 * user preferences query to refetch the latest data.
 *
 * @param client - MixrClient instance for API calls
 * @returns TanStack Mutation result with `mutate(request)` method
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateUserPreferences(client);
 * mutate({ equipment_ids: [1, 2], ingredient_ids: [3, 4] });
 * ```
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { UpdateUserPreferencesRequest } from '../types';
import { QUERY_KEYS } from './query-keys';

export function useUpdateUserPreferences(client: MixrClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateUserPreferencesRequest) => {
      const response = await client.updateUserPreferences(request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.preferences });
    },
  });
}
