# @sudobility/mixr_client

React client library for the MIXR cocktail recipe API with TanStack Query hooks and Zustand state management.

## Installation

```bash
bun add @sudobility/mixr_client
```

### Peer Dependencies

```bash
bun add @sudobility/di @sudobility/mixr_types @sudobility/types @tanstack/react-query react zustand
```

## Usage

### API Client

```typescript
import { MixrClient } from '@sudobility/mixr_client';

const client = new MixrClient(baseUrl, networkClient, authToken?);

// Equipment, ingredients, moods
const equipment = await client.getEquipment({ subcategory: 'essential' });
const ingredients = await client.getIngredients();
const moods = await client.getMoods();

// Recipes
const recipe = await client.generateRecipe({ equipment_ids: [1, 2], ingredient_ids: [3, 4], mood_id: 1 });
const recipes = await client.getRecipes({ limit: 10, offset: 0 });

// Ratings
await client.submitRecipeRating(recipeId, { stars: 5, review: 'Great!' });
const aggregate = await client.getRecipeRatingAggregate(recipeId);

// User (auth required)
const user = await client.getCurrentUser();
const favorites = await client.getUserFavorites();
```

### React Hooks

All hooks accept `client: MixrClient` as the first parameter.

```typescript
import { useEquipments, useRecipes, useCreateRecipe } from '@sudobility/mixr_client';

function RecipeList() {
  const { data, fetchNextPage, hasNextPage } = useRecipes(client, 10);
  const createRecipe = useCreateRecipe(client, useRecipeStore);
  // ...
}
```

| Hook | Type | Cache |
|------|------|-------|
| `useEquipments` | Query | 30min |
| `useEquipmentSubcategories` | Query | 1hr |
| `useIngredients` | Query | 30min |
| `useIngredientSubcategories` | Query | 1hr |
| `useMoods` | Query | 1hr |
| `useRecipes` | InfiniteQuery | 5min |
| `useRecipe` | Query | 10min |
| `useCreateRecipe` | Mutation | -- |

### Zustand Store

```typescript
import { createRecipeStore } from '@sudobility/mixr_client';

const useRecipeStore = createRecipeStore(localStorage);
```

## API Methods

| Category | Methods |
|----------|---------|
| Health | `healthCheck()`, `getVersion()` |
| Equipment | `getEquipment()`, `getEquipmentById()`, `getEquipmentSubcategories()` |
| Ingredients | `getIngredients()`, `getIngredientById()`, `getIngredientSubcategories()` |
| Moods | `getMoods()`, `getMoodById()` |
| Recipes | `generateRecipe()`, `getRecipes()`, `getRecipeById()` |
| Ratings | `submitRecipeRating()`, `getRecipeRatings()`, `getRecipeRatingAggregate()`, `deleteRecipeRating()` |
| User | `getCurrentUser()`, `updateCurrentUser()`, `getUserPreferences()`, `updateUserPreferences()`, `getUserRecipes()`, `getUserFavorites()` |
| Favorites | `addFavorite()`, `removeFavorite()` |

## Development

```bash
bun run build        # Build to dist/
bun run build:watch  # Watch mode
bun run test         # Run Vitest
bun run lint         # ESLint check
bun run typecheck    # TypeScript check
```

## Related Packages

- `@sudobility/mixr_types` -- shared type definitions
- `@sudobility/mixr_lib` -- business logic and utilities
- `mixr` -- frontend web app

## License

MIT
