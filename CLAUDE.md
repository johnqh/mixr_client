# MIXR Client

React client library for MIXR API with TanStack Query hooks and Zustand state management.

**npm**: `@sudobility/mixr_client` (restricted)

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Bun
- **Package Manager**: Bun (do not use npm/yarn/pnpm for installing dependencies)
- **Build**: TypeScript compiler (tsc)
- **Test**: Vitest + React Testing Library + happy-dom

## Project Structure

```
src/
├── index.ts              # Public exports (all APIs)
├── types.ts              # Type re-exports from mixr_types
├── network/
│   └── mixr-client.ts    # HTTP client (30+ API methods)
├── hooks/
│   ├── use-equipments.ts           # Equipment queries (30min cache)
│   ├── use-equipment-subcategories.ts # Subcategory queries (1hr cache)
│   ├── use-ingredients.ts          # Ingredient queries (30min cache)
│   ├── use-ingredient-subcategories.ts # Subcategory queries (1hr cache)
│   ├── use-moods.ts                # Mood queries (1hr cache)
│   ├── use-recipes.ts              # Infinite scroll recipes (5min cache)
│   ├── use-recipe.ts               # Single recipe with store (10min cache)
│   └── use-create-recipe.ts        # Recipe generation mutation
├── stores/
│   └── recipe-store.ts    # Zustand store with persistence
├── utils/
│   └── helpers.ts         # buildUrl, createHeaders, handleApiError
└── __tests__/             # Comprehensive test suite
    ├── setup.ts
    ├── network/
    ├── hooks/
    ├── stores/
    └── utils/
```

## Commands

```bash
bun run build        # Build to dist/
bun run build:watch  # Watch mode build
bun run clean        # Remove dist/
bun run test         # Run Vitest
bun run lint         # Run ESLint
bun run typecheck    # TypeScript check
bun run format       # Format with Prettier
```

## MixrClient API

```typescript
import { MixrClient } from '@sudobility/mixr_client';

const client = new MixrClient(baseUrl, networkClient, authToken?);
// OR
const client = new MixrClient({ baseUrl, networkClient, authToken? });
```

| Category | Methods |
|----------|---------|
| Health | `healthCheck()`, `getVersion()` |
| Equipment | `getEquipment(params?)`, `getEquipmentById(id)`, `getEquipmentSubcategories()` |
| Ingredients | `getIngredients(params?)`, `getIngredientById(id)`, `getIngredientSubcategories()` |
| Moods | `getMoods()`, `getMoodById(id)` |
| Recipes | `generateRecipe(req)`, `getRecipes(params?)`, `getRecipeById(id)` |
| Ratings | `submitRecipeRating(id, req)`, `getRecipeRatings(id)`, `getRecipeRatingAggregate(id)`, `deleteRecipeRating(recipeId, ratingId)` |
| User | `getCurrentUser()`, `updateCurrentUser(req)`, `getUserPreferences()`, `updateUserPreferences(req)`, `getUserRecipes()`, `getUserFavorites()` |
| Favorites | `addFavorite(req)`, `removeFavorite(recipeId)` |

## Hooks

All hooks accept `client: MixrClient` as first parameter.

| Hook | Type | Store | Cache |
|------|------|-------|-------|
| `useEquipments` | Query | No | 30min |
| `useEquipmentSubcategories` | Query | No | 1hr |
| `useIngredients` | Query | No | 30min |
| `useIngredientSubcategories` | Query | No | 1hr |
| `useMoods` | Query | No | 1hr |
| `useRecipes` | InfiniteQuery | Yes | 5min |
| `useRecipe` | Query | Yes (placeholder) | 10min |
| `useCreateRecipe` | Mutation | Yes (update) | - |

### Query Key Structure
- Equipment: `['equipment', 'list', subcategory?]`, `['equipment', 'subcategories']`
- Ingredients: `['ingredients', 'list', subcategory?]`, `['ingredients', 'subcategories']`
- Moods: `['moods', 'list']`
- Recipes: `['recipes', 'list', limit]`, `['recipes', 'detail', recipeId]`

## Store

```typescript
import { createRecipeStore } from '@sudobility/mixr_client';

// Factory pattern - inject storage for platform compatibility
const useRecipeStore = createRecipeStore(localStorage);
```

Store shape: `recipes: Map<number, Recipe>`, `recipeList: Recipe[]`
Methods: `setRecipe`, `setRecipes`, `getRecipe`, `hasRecipe`, `clear`

## Peer Dependencies

- `@sudobility/di` >= 1.5.36
- `@sudobility/mixr_types` >= 0.0.8
- `@sudobility/types` >= 1.9.51
- `@tanstack/react-query` >= 5.0.0
- `react` >= 18.0.0
- `zustand` >= 5.0.0

## Architecture

```
mixr_client (this package)
    ^
mixr_lib (business logic)
    ^
mixr (frontend)
```

## Code Patterns

### Error Handling
```typescript
const response = await networkClient.get<T>(url, { headers });
if (!response.ok || !response.data) {
  throw handleApiError(response, 'operation name');
}
return response.data;
```

### Hook with Store
```typescript
export function useRecipe(client: MixrClient, useRecipeStore: UseRecipeStore, recipeId: number) {
  const store = useRecipeStore();
  return useQuery({
    queryKey: ['recipes', 'detail', recipeId],
    queryFn: () => client.getRecipeById(recipeId),
    placeholderData: store.getRecipe(recipeId) ? { ... } : undefined,
  });
}
```
