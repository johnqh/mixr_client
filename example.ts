/**
 * Example usage of MixrClient
 */

import { MixrClient, FetchNetworkClient } from './src';

async function main() {
  // Initialize the client
  const networkClient = new FetchNetworkClient();
  const client = new MixrClient('http://localhost:3000', networkClient);

  try {
    // Health check
    console.log('Checking API health...');
    const health = await client.healthCheck();
    console.log('Health:', health);

    // Get API version
    const version = await client.getVersion();
    console.log('Version:', version);

    // Get all moods
    console.log('\nFetching moods...');
    const moods = await client.getMoods();
    console.log('Moods:', moods.data);

    // Get equipment
    console.log('\nFetching equipment...');
    const equipment = await client.getEquipment();
    console.log('Equipment count:', equipment.count);

    // Get equipment subcategories
    const equipmentSubcategories = await client.getEquipmentSubcategories();
    console.log('Equipment subcategories:', equipmentSubcategories.data);

    // Get ingredients
    console.log('\nFetching ingredients...');
    const ingredients = await client.getIngredients();
    console.log('Ingredients count:', ingredients.count);

    // Get ingredient subcategories
    const ingredientSubcategories = await client.getIngredientSubcategories();
    console.log('Ingredient subcategories:', ingredientSubcategories.data);

    // Get recipes with pagination
    console.log('\nFetching recipes...');
    const recipes = await client.getRecipes({ limit: 5, offset: 0 });
    console.log('Recipes count:', recipes.count);

    // Example: Generate a recipe (commented out as it requires valid IDs)
    // const newRecipe = await client.generateRecipe({
    //   equipment_ids: [1, 2, 3],
    //   ingredient_ids: [1, 2, 3, 4],
    //   mood_id: 1,
    // });
    // console.log('Generated recipe:', newRecipe.data);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run the example
if (require.main === module) {
  main();
}
