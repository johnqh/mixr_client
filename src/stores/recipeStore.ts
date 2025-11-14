/**
 * Zustand store for recipe data
 * Provides local storage and caching for recipes
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Recipe } from '../types';

interface RecipeStore {
  recipes: Map<number, Recipe>;
  recipeList: Recipe[];
  setRecipe: (recipe: Recipe) => void;
  setRecipes: (recipes: Recipe[]) => void;
  getRecipe: (id: number) => Recipe | undefined;
  hasRecipe: (id: number) => boolean;
  clear: () => void;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      recipes: new Map(),
      recipeList: [],

      setRecipe: (recipe: Recipe) => {
        set((state) => {
          const newRecipes = new Map(state.recipes);
          newRecipes.set(recipe.id, recipe);

          // Also update in recipeList if it exists
          const existingIndex = state.recipeList.findIndex((r) => r.id === recipe.id);
          const newRecipeList = [...state.recipeList];

          if (existingIndex >= 0) {
            newRecipeList[existingIndex] = recipe;
          } else {
            newRecipeList.unshift(recipe); // Add new recipe at the beginning
          }

          return {
            recipes: newRecipes,
            recipeList: newRecipeList,
          };
        });
      },

      setRecipes: (recipes: Recipe[]) => {
        set((state) => {
          const newRecipes = new Map(state.recipes);

          // Add all recipes to the map
          recipes.forEach((recipe) => {
            newRecipes.set(recipe.id, recipe);
          });

          return {
            recipes: newRecipes,
            recipeList: recipes,
          };
        });
      },

      getRecipe: (id: number) => {
        return get().recipes.get(id);
      },

      hasRecipe: (id: number) => {
        return get().recipes.has(id);
      },

      clear: () => {
        set({
          recipes: new Map(),
          recipeList: [],
        });
      },
    }),
    {
      name: 'mixr-recipe-storage',
      storage: createJSONStorage(() => localStorage, {
        // Custom serializer to handle Map objects
        replacer: (_key, value) => {
          if (value instanceof Map) {
            return Array.from(value.entries());
          }
          return value;
        },
        // Custom deserializer to restore Map objects
        reviver: (_key, value) => {
          if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
            // Check if this looks like Map entries
            const isMapEntries = value.every(
              (item) => Array.isArray(item) && item.length === 2 && typeof item[0] === 'number'
            );
            if (isMapEntries) {
              return new Map(value);
            }
          }
          return value;
        },
      }),
    }
  )
);
