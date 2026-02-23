# Improvement Plans for @sudobility/mixr_client

## Priority 1 - High Impact

### 1. Reduce Code Duplication in MixrClient Methods -- COMPLETED
- The `MixrClient` class (678 lines) has extreme repetition: every single method follows the exact same pattern of `createHeaders` -> `networkClient.get/post/put/delete` -> `if (!response.ok || !response.data)` -> `throw handleApiError` -> `return response.data`.
- Methods like `getRecipes`, `getUserRecipes`, and `getUserFavorites` have nearly identical pagination URL building logic duplicated three times.
- A private helper method (e.g., `request<T>(method, path, body?, params?)`) would reduce each API method from 10+ lines to 1-2 lines, dramatically improving maintainability.
- This duplication increases the risk of inconsistencies (e.g., one method might forget error handling).
- **Resolution:** Added private `request<T>(method, path, operationName, body?)` helper and `buildQueryString()` method. Reduced class from 678 lines to ~460 lines. Every public method is now 1-3 lines. All existing tests pass without modification.

### 2. Add Missing Hook Tests for Ingredients, Moods, and Subcategories -- COMPLETED
- Test coverage exists for equipment hooks (`use-equipments.test.tsx`, `use-equipment-subcategories.test.tsx`), recipe hooks (`use-recipes.test.tsx`, `use-recipe.test.tsx`, `use-create-recipe.test.tsx`), network client, store, and helpers.
- Missing test files: `use-ingredients.test.tsx`, `use-ingredient-subcategories.test.tsx`, `use-moods.test.tsx` -- these are functionally identical to the equipment hooks but have zero coverage.
- The ingredient and mood hooks may have subtle differences in query key structure or caching behavior that should be verified.
- **Resolution:** Added `use-ingredients.test.tsx` (4 tests), `use-ingredient-subcategories.test.tsx` (4 tests), and `use-moods.test.tsx` (4 tests). Tests cover success, error handling, null data fallback, and correct API endpoint verification. Total test count: 54 -> 66.

### 3. Improve Type Safety for API Responses -- SKIPPED
- `MixrClient` methods return the full `MixrApiResponse<T>` wrapper (e.g., `Promise<EquipmentListResponse>` which includes `success`, `data`, `error`, `count`) rather than unwrapping to `T`.
- This differs from `WhisperlyClient` which extracts `.data` from the response in `handleNetworkResponse`.
- Consumers must check `response.success` and access `response.data` every time, adding boilerplate. The client should unwrap successful responses and throw on failures.
- **Reason for skip:** This is a breaking change to the public API. All hooks and downstream consumers (mixr_lib, mixr app) access `response.data`, `response.count`, etc. Changing return types requires coordinated updates across multiple packages.

## Priority 2 - Medium Impact

### 4. Add JSDoc to Hook Return Values and Cache Behavior -- COMPLETED
- Hooks like `useEquipments`, `useRecipes`, `useMoods` have no JSDoc documenting their cache durations (30min, 5min, 1hr), stale-while-revalidate behavior, or query key structure.
- `useRecipes` uses `useInfiniteQuery` with specific `getNextPageParam` logic that is not documented.
- `useRecipe` uses `placeholderData` from the store, which is a subtle optimization that should be documented for maintainers.
- **Resolution:** Added comprehensive JSDoc to all 8 existing hooks and 7 new hooks. Documentation includes cache durations, query key structure, parameter descriptions, return types, and usage examples.

### 5. Add Request Cancellation with AbortSignal -- SKIPPED
- No hooks or client methods support request cancellation via `AbortSignal`.
- TanStack Query passes a `signal` to `queryFn`, but the hooks do not forward it to the `MixrClient` methods.
- This can cause state updates on unmounted components and wasted network requests during rapid navigation.
- **Reason for skip:** Requires updating the `MixrClient` public method signatures to accept `AbortSignal`, which changes the API surface. The `NetworkClient` interface already supports `signal` in options, but threading it through all 25+ methods and updating all call sites is a larger change best done separately.

### 6. Centralize Query Key Management -- COMPLETED
- Query keys are defined inline in each hook file (e.g., `['equipment', 'list', subcategory?]`, `['recipes', 'detail', recipeId]`).
- There is no centralized `QUERY_KEYS` constant (unlike `whisperly_client` which has `QUERY_KEYS` in `types.ts`).
- Centralizing query keys would prevent typos and make invalidation patterns more discoverable.
- **Resolution:** Created `src/hooks/query-keys.ts` with a fully-typed `QUERY_KEYS` constant covering equipment, ingredients, moods, recipes, and user domains. All hooks updated to use `QUERY_KEYS`. Exported from the package for consumer use (e.g., manual cache invalidation). Also added `.all` keys per domain for broad invalidation patterns.

## Priority 3 - Nice to Have

### 7. Add Retry Configuration and Timeout Handling -- SKIPPED
- No configurable retry logic exists for transient network failures.
- TanStack Query has built-in retry support, but the hooks use default settings without explicit configuration.
- Adding a `retryConfig` option to `MixrClientConfig` and forwarding to hooks would improve resilience.
- **Reason for skip:** Infrastructure-level change that adds configuration complexity. TanStack Query's defaults (3 retries with exponential backoff) are reasonable for most use cases.

### 8. Add User-Related Hooks -- COMPLETED
- The `MixrClient` has 8 user-related methods (`getCurrentUser`, `updateCurrentUser`, `getUserPreferences`, `updateUserPreferences`, `getUserRecipes`, `getUserFavorites`, `addFavorite`, `removeFavorite`) but no corresponding hook files exist for them.
- User/preferences/favorites hooks would complete the hooks layer and match the pattern established for equipment, ingredients, moods, and recipes.
- The `mixr` app currently calls these methods directly or through app-level hooks, bypassing the client library's hook layer.
- **Resolution:** Added 7 new hook files: `use-current-user.ts`, `use-update-user.ts`, `use-user-preferences.ts`, `use-update-user-preferences.ts`, `use-user-recipes.ts`, `use-user-favorites.ts`, `use-toggle-favorite.ts` (contains `useAddFavorite` and `useRemoveFavorite`). All hooks follow existing patterns, include JSDoc, use centralized query keys, and support `enabled` flag for auth gating. Mutation hooks invalidate relevant queries on success.
