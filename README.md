# @sudobility/mixr_client

TypeScript client library for the MIXR API - A cocktail recipe management system.

## Installation

```bash
npm install @sudobility/mixr_client @sudobility/types @sudobility/di
```

### For React Applications

If using React hooks:

```bash
npm install @sudobility/mixr_client @tanstack/react-query react zustand
```

## Features

- Full TypeScript support with type definitions
- Built on top of NetworkClient from @sudobility/di
- Coverage of all MIXR API endpoints:
  - Equipment management
  - Ingredient management
  - Mood management
  - Recipe generation and retrieval
  - Health check endpoints
- React hooks with React Query for data fetching and caching
- Zustand store for local state management and persistence
- Automatic data synchronization between hooks

## Quick Start

```typescript
import { MixrClient, FetchNetworkClient } from '@sudobility/mixr_client';

// Initialize the client
const networkClient = new FetchNetworkClient();
const client = new MixrClient('http://localhost:3000', networkClient);

// Health check
const health = await client.healthCheck();
console.log(health);

// Get all moods
const moods = await client.getMoods();
console.log(moods.data);

// Get equipment
const equipment = await client.getEquipment();
console.log(equipment.data);

// Get ingredients
const ingredients = await client.getIngredients();
console.log(ingredients.data);

// Generate a recipe
const recipe = await client.generateRecipe({
  equipment_ids: [1, 2, 3],
  ingredient_ids: [1, 2, 3],
  mood_id: 1,
});
console.log(recipe.data);

// Get all recipes with pagination
const recipes = await client.getRecipes({ limit: 10, offset: 0 });
console.log(recipes.data);
```

## API Reference

### Health Check

```typescript
// Get API version
const version = await client.getVersion();

// Health check
const health = await client.healthCheck();
```

### Equipment

```typescript
// Get all equipment
const allEquipment = await client.getEquipment();

// Get equipment by subcategory
const essentialEquipment = await client.getEquipment('essential');

// Get equipment by ID
const equipment = await client.getEquipmentById(1);

// Get equipment subcategories
const subcategories = await client.getEquipmentSubcategories();
```

### Ingredients

```typescript
// Get all ingredients
const allIngredients = await client.getIngredients();

// Get ingredients by subcategory
const spirits = await client.getIngredients('spirit');

// Get ingredient by ID
const ingredient = await client.getIngredientById(1);

// Get ingredient subcategories
const subcategories = await client.getIngredientSubcategories();
```

### Moods

```typescript
// Get all moods
const moods = await client.getMoods();

// Get mood by ID
const mood = await client.getMoodById(1);
```

### Recipes

```typescript
// Generate a new recipe
const recipe = await client.generateRecipe({
  equipment_ids: [1, 2, 3],
  ingredient_ids: [1, 2, 3, 4],
  mood_id: 1,
});

// Get all recipes with pagination
const recipes = await client.getRecipes({ limit: 10, offset: 0 });

// Get recipe by ID
const recipe = await client.getRecipeById(1);
```

## Type Definitions

All types are exported from the main package:

```typescript
import type {
  Equipment,
  EquipmentSubcategory,
  Ingredient,
  IngredientSubcategory,
  Mood,
  Recipe,
  RecipeIngredient,
  RecipeEquipment,
  GenerateRecipeRequest,
  MixrApiResponse,
} from '@sudobility/mixr_client';
```

## Error Handling

All methods throw errors when requests fail. Wrap calls in try-catch blocks:

```typescript
try {
  const recipe = await client.getRecipeById(999);
} catch (error) {
  console.error('Failed to get recipe:', error.message);
}
```

## React Hooks

This library provides React hooks for easy integration with React applications. See [HOOKS.md](./HOOKS.md) for detailed documentation.

### Available Hooks

- **Equipment**: `useEquipmentSubcategories()`, `useEquipments(subcategory)`
- **Ingredients**: `useIngredientSubcategories()`, `useIngredients(subcategory)`
- **Moods**: `useMoods()`
- **Recipes**: `useRecipes(limit)`, `useRecipe(recipeId)`, `useCreateRecipe()`

### Quick Example

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MixrClient, FetchNetworkClient, useRecipes } from '@sudobility/mixr_client';

const queryClient = new QueryClient();
const networkClient = new FetchNetworkClient();
const mixrClient = new MixrClient('http://localhost:3000', networkClient);

function RecipeList() {
  const { data, fetchNextPage, hasNextPage } = useRecipes(mixrClient, 10);

  return (
    <div>
      {data?.pages.map((page) =>
        page.recipes.map((recipe) => (
          <div key={recipe.id}>{recipe.name}</div>
        ))
      )}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load More</button>}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecipeList />
    </QueryClientProvider>
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## Documentation

- [API Reference](./README.md) - Basic API client usage
- [React Hooks](./HOOKS.md) - Detailed React hooks documentation

## License

MIT
