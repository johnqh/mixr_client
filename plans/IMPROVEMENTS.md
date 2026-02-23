# Improvement Plans for @sudobility/mixr_client

## Priority 1 - High Impact

### 1. Reduce Code Duplication in MixrClient Methods
- The `MixrClient` class (678 lines) has extreme repetition: every single method follows the exact same pattern of `createHeaders` -> `networkClient.get/post/put/delete` -> `if (!response.ok || !response.data)` -> `throw handleApiError` -> `return response.data`.
- Methods like `getRecipes`, `getUserRecipes`, and `getUserFavorites` have nearly identical pagination URL building logic duplicated three times.
- A private helper method (e.g., `request<T>(method, path, body?, params?)`) would reduce each API method from 10+ lines to 1-2 lines, dramatically improving maintainability.
- This duplication increases the risk of inconsistencies (e.g., one method might forget error handling).

### 2. Add Missing Hook Tests for Ingredients, Moods, and Subcategories
- Test coverage exists for equipment hooks (`use-equipments.test.tsx`, `use-equipment-subcategories.test.tsx`), recipe hooks (`use-recipes.test.tsx`, `use-recipe.test.tsx`, `use-create-recipe.test.tsx`), network client, store, and helpers.
- Missing test files: `use-ingredients.test.tsx`, `use-ingredient-subcategories.test.tsx`, `use-moods.test.tsx` -- these are functionally identical to the equipment hooks but have zero coverage.
- The ingredient and mood hooks may have subtle differences in query key structure or caching behavior that should be verified.

### 3. Improve Type Safety for API Responses
- `MixrClient` methods return the full `MixrApiResponse<T>` wrapper (e.g., `Promise<EquipmentListResponse>` which includes `success`, `data`, `error`, `count`) rather than unwrapping to `T`.
- This differs from `WhisperlyClient` which extracts `.data` from the response in `handleNetworkResponse`.
- Consumers must check `response.success` and access `response.data` every time, adding boilerplate. The client should unwrap successful responses and throw on failures.

## Priority 2 - Medium Impact

### 4. Add JSDoc to Hook Return Values and Cache Behavior
- Hooks like `useEquipments`, `useRecipes`, `useMoods` have no JSDoc documenting their cache durations (30min, 5min, 1hr), stale-while-revalidate behavior, or query key structure.
- `useRecipes` uses `useInfiniteQuery` with specific `getNextPageParam` logic that is not documented.
- `useRecipe` uses `placeholderData` from the store, which is a subtle optimization that should be documented for maintainers.

### 5. Add Request Cancellation with AbortSignal
- No hooks or client methods support request cancellation via `AbortSignal`.
- TanStack Query passes a `signal` to `queryFn`, but the hooks do not forward it to the `MixrClient` methods.
- This can cause state updates on unmounted components and wasted network requests during rapid navigation.

### 6. Centralize Query Key Management
- Query keys are defined inline in each hook file (e.g., `['equipment', 'list', subcategory?]`, `['recipes', 'detail', recipeId]`).
- There is no centralized `QUERY_KEYS` constant (unlike `whisperly_client` which has `QUERY_KEYS` in `types.ts`).
- Centralizing query keys would prevent typos and make invalidation patterns more discoverable.

## Priority 3 - Nice to Have

### 7. Add Retry Configuration and Timeout Handling
- No configurable retry logic exists for transient network failures.
- TanStack Query has built-in retry support, but the hooks use default settings without explicit configuration.
- Adding a `retryConfig` option to `MixrClientConfig` and forwarding to hooks would improve resilience.

### 8. Add User-Related Hooks
- The `MixrClient` has 8 user-related methods (`getCurrentUser`, `updateCurrentUser`, `getUserPreferences`, `updateUserPreferences`, `getUserRecipes`, `getUserFavorites`, `addFavorite`, `removeFavorite`) but no corresponding hook files exist for them.
- User/preferences/favorites hooks would complete the hooks layer and match the pattern established for equipment, ingredients, moods, and recipes.
- The `mixr` app currently calls these methods directly or through app-level hooks, bypassing the client library's hook layer.
