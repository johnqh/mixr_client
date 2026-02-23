/**
 * Hook to update the current user's profile.
 *
 * Uses TanStack Query's `useMutation`. On success, invalidates the
 * user profile query to refetch the latest data.
 *
 * @param client - MixrClient instance for API calls
 * @returns TanStack Mutation result with `mutate(request)` method
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateUser(client);
 * mutate({ display_name: 'New Name' });
 * ```
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MixrClient } from '../network/mixr-client';
import type { UpdateUserRequest } from '../types';
import { QUERY_KEYS } from './query-keys';

export function useUpdateUser(client: MixrClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateUserRequest) => {
      const response = await client.updateCurrentUser(request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.profile });
    },
  });
}
