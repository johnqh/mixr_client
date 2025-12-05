/**
 * Type for the recipe store hook returned by createRecipeStore
 */

import type { RecipeStore } from '../stores/recipe-store';

export type UseRecipeStore = () => RecipeStore;
