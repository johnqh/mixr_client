# @sudobility/mixr_client

TypeScript client library for the MIXR API - A cocktail recipe management system.

## Installation

```bash
npm install @sudobility/mixr_client @sudobility/types @sudobility/di
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

## License

MIT
