# React Hooks Documentation

This document provides detailed information about the React hooks available in `@sudobility/mixr_client`.

## Table of Contents

- [Setup](#setup)
- [Equipment Hooks](#equipment-hooks)
- [Ingredient Hooks](#ingredient-hooks)
- [Mood Hooks](#mood-hooks)
- [Recipe Hooks](#recipe-hooks)
- [Recipe Store](#recipe-store)

## Setup

### Install Dependencies

```bash
npm install @sudobility/mixr_client @tanstack/react-query react zustand
```

### Setup React Query Provider

Wrap your app with the `QueryClientProvider`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MixrClient, FetchNetworkClient } from '@sudobility/mixr_client';

const queryClient = new QueryClient();
const networkClient = new FetchNetworkClient();
const mixrClient = new MixrClient('http://localhost:3000', networkClient);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourComponents />
    </QueryClientProvider>
  );
}
```

## Equipment Hooks

### `useEquipmentSubcategories(client)`

Returns a list of equipment subcategories.

**Parameters:**
- `client`: MixrClient instance

**Returns:** React Query result with subcategories array

**Example:**
```typescript
import { useEquipmentSubcategories } from '@sudobility/mixr_client';

function EquipmentCategories() {
  const { data, isLoading, error } = useEquipmentSubcategories(mixrClient);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((category) => (
        <li key={category}>{category}</li>
      ))}
    </ul>
  );
}
```

**Cache:** 1 hour (subcategories rarely change)

---

### `useEquipments(client, subcategory?)`

Returns a list of equipment, optionally filtered by subcategory.

**Parameters:**
- `client`: MixrClient instance
- `subcategory` (optional): Filter by subcategory (`'essential' | 'glassware' | 'garnish' | 'advanced'`)

**Returns:** React Query result with equipment array

**Example:**
```typescript
import { useEquipments } from '@sudobility/mixr_client';

function EquipmentList() {
  const { data, isLoading } = useEquipments(mixrClient, 'essential');

  return (
    <ul>
      {data?.map((equipment) => (
        <li key={equipment.id}>{equipment.name}</li>
      ))}
    </ul>
  );
}
```

**Cache:** 30 minutes

## Ingredient Hooks

### `useIngredientSubcategories(client)`

Returns a list of ingredient subcategories.

**Parameters:**
- `client`: MixrClient instance

**Returns:** React Query result with subcategories array

**Example:**
```typescript
import { useIngredientSubcategories } from '@sudobility/mixr_client';

function IngredientCategories() {
  const { data, isLoading } = useIngredientSubcategories(mixrClient);

  return (
    <select>
      {data?.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
```

**Cache:** 1 hour

---

### `useIngredients(client, subcategory?)`

Returns a list of ingredients, optionally filtered by subcategory.

**Parameters:**
- `client`: MixrClient instance
- `subcategory` (optional): Filter by subcategory (`'spirit' | 'wine' | 'other_alcohol' | 'fruit' | 'spice' | 'other'`)

**Returns:** React Query result with ingredients array

**Example:**
```typescript
import { useIngredients } from '@sudobility/mixr_client';

function IngredientList() {
  const [category, setCategory] = useState('spirit');
  const { data, isLoading } = useIngredients(mixrClient, category);

  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value as any)}>
        <option value="spirit">Spirits</option>
        <option value="fruit">Fruits</option>
      </select>
      <ul>
        {data?.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Cache:** 30 minutes

## Mood Hooks

### `useMoods(client)`

Returns a list of all moods.

**Parameters:**
- `client`: MixrClient instance

**Returns:** React Query result with moods array

**Example:**
```typescript
import { useMoods } from '@sudobility/mixr_client';

function MoodSelector() {
  const { data, isLoading } = useMoods(mixrClient);

  return (
    <div>
      {data?.map((mood) => (
        <button key={mood.id}>
          {mood.emoji} {mood.name}
        </button>
      ))}
    </div>
  );
}
```

**Cache:** 1 hour

## Recipe Hooks

### `useRecipes(client, limit)`

Returns a paginated list of recipes with infinite scroll support.

**Parameters:**
- `client`: MixrClient instance
- `limit`: Number of recipes per page (default: 10)

**Returns:** React Query infinite query result with recipes and `fetchNextPage()` function

**Features:**
- Automatic pagination support
- Integrates with Zustand store for local caching
- Returns `fetchNextPage()` function for loading more recipes

**Example:**
```typescript
import { useRecipes } from '@sudobility/mixr_client';

function RecipeList() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRecipes(mixrClient, 10);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.recipes.map((recipe) => (
            <div key={recipe.id}>
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
            </div>
          ))}
        </div>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

**Cache:** 5 minutes

---

### `useRecipe(client, recipeId)`

Returns a single recipe by ID. Integrates with Zustand store to return local data immediately if available, while refetching in the background.

**Parameters:**
- `client`: MixrClient instance
- `recipeId`: Recipe ID (can be `number | null | undefined`)

**Returns:** React Query result with recipe data

**Features:**
- Returns cached data immediately if available in Zustand store
- Automatically refetches in background to ensure data is fresh
- Shares data with `useRecipes` and `useCreateRecipe`

**Example:**
```typescript
import { useRecipe } from '@sudobility/mixr_client';

function RecipeDetail({ recipeId }: { recipeId: number }) {
  const { data, isLoading, isFetching } = useRecipe(mixrClient, recipeId);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Recipe not found</div>;

  return (
    <div>
      {isFetching && <span>Updating...</span>}
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <h2>Ingredients</h2>
      <ul>
        {data.ingredients.map((ing) => (
          <li key={ing.id}>
            {ing.name} - {ing.amount}
          </li>
        ))}
      </ul>
      <h2>Steps</h2>
      <ol>
        {data.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
```

**Cache:** 10 minutes

---

### `useCreateRecipe(client)`

Creates a new recipe and automatically updates the Zustand store and React Query cache.

**Parameters:**
- `client`: MixrClient instance

**Returns:** React Query mutation result

**Features:**
- Automatically updates Zustand store with created recipe
- Invalidates recipe list queries to trigger refetch
- Updates recipe detail query cache
- Shares data with `useRecipes` and `useRecipe`

**Example:**
```typescript
import { useCreateRecipe } from '@sudobility/mixr_client';

function RecipeGenerator() {
  const { mutate, isPending, isSuccess, data } = useCreateRecipe(mixrClient);

  const handleGenerate = () => {
    mutate({
      equipment_ids: [1, 2, 3],
      ingredient_ids: [1, 2, 3, 4],
      mood_id: 1,
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isPending}>
        {isPending ? 'Generating...' : 'Generate Recipe'}
      </button>
      {isSuccess && data && (
        <div>
          <h2>Created: {data.name}</h2>
          <p>Recipe ID: {data.id}</p>
        </div>
      )}
    </div>
  );
}
```

## Recipe Store

The `useRecipeStore` hook provides direct access to the Zustand store for advanced use cases.

**Methods:**
- `setRecipe(recipe)`: Add or update a recipe in the store
- `setRecipes(recipes)`: Set the recipe list
- `getRecipe(id)`: Get a recipe by ID
- `hasRecipe(id)`: Check if a recipe exists in the store
- `clear()`: Clear all recipes from the store

**Example:**
```typescript
import { useRecipeStore } from '@sudobility/mixr_client';

function RecipeManager() {
  const { recipes, recipeList, clear } = useRecipeStore();

  return (
    <div>
      <p>Total recipes in store: {recipes.size}</p>
      <p>Recipes in list: {recipeList.length}</p>
      <button onClick={clear}>Clear Store</button>
    </div>
  );
}
```

## Data Sharing Between Hooks

The recipe hooks share data through the Zustand store:

1. **`useRecipes`** → Populates store with fetched recipes
2. **`useRecipe`** → Returns local data immediately if available in store
3. **`useCreateRecipe`** → Adds newly created recipe to store

This means:
- If you call `useRecipes` first, the recipes are cached locally
- Then calling `useRecipe` with one of those recipe IDs returns data instantly
- The data is persisted in localStorage and survives page refreshes
- Background refetches keep the data fresh

**Example:**
```typescript
function App() {
  // Load recipes list - populates Zustand store
  const { data: recipes } = useRecipes(mixrClient, 10);

  // Later, when viewing a recipe detail
  // This returns instantly from Zustand store if the recipe was in the list
  const { data: recipe } = useRecipe(mixrClient, recipes?.[0]?.id);

  // Creating a new recipe updates the store immediately
  const { mutate } = useCreateRecipe(mixrClient);
}
```

## Best Practices

1. **Single MixrClient Instance**: Create one MixrClient instance and pass it to all hooks
2. **QueryClient Configuration**: Configure appropriate cache times based on your needs
3. **Error Handling**: Always handle loading and error states
4. **Pagination**: Use `hasNextPage` to conditionally render the "Load More" button
5. **Store Cleanup**: Call `clear()` when user logs out or changes context
6. **Type Safety**: All hooks are fully typed with TypeScript
