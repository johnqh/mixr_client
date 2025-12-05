/**
 * Zustand store for recipe data
 * Provides local storage and caching for recipes
 * React Native compatible - accepts storage service from DI
 */

import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { PlatformStorage } from '@sudobility/di';
import type { Recipe } from '../types';

export interface RecipeStore {
  recipes: Map<number, Recipe>;
  recipeList: Recipe[];
  setRecipe: (recipe: Recipe) => void;
  setRecipes: (recipes: Recipe[]) => void;
  getRecipe: (id: number) => Recipe | undefined;
  hasRecipe: (id: number) => boolean;
  clear: () => void;
}

/**
 * Custom JSON serializer options for handling Map objects
 */
const jsonStorageOptions = {
  // Custom serializer to handle Map objects
  replacer: (_key: string, value: unknown) => {
    if (value instanceof Map) {
      return Array.from(value.entries());
    }
    return value;
  },
  // Custom deserializer to restore Map objects
  reviver: (_key: string, value: unknown) => {
    if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
      // Check if this looks like Map entries
      const isMapEntries = value.every(
        (item) => Array.isArray(item) && item.length === 2 && typeof item[0] === 'number'
      );
      if (isMapEntries) {
        return new Map(value as [number, Recipe][]);
      }
    }
    return value;
  },
};

/**
 * Adapts PlatformStorage to Zustand's StateStorage interface
 * Handles both sync and async storage implementations
 */
function adaptPlatformStorage(storage: PlatformStorage): StateStorage {
  return {
    getItem: async (name: string): Promise<string | null> => {
      const result = await Promise.resolve(storage.getItem(name));
      return result ?? null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
      await Promise.resolve(storage.setItem(name, value));
    },
    removeItem: async (name: string): Promise<void> => {
      await Promise.resolve(storage.removeItem(name));
    },
  };
}

/**
 * Creates the recipe store state and actions
 */
function createRecipeStoreState(
  set: (fn: (state: RecipeStore) => Partial<RecipeStore>) => void,
  get: () => RecipeStore
): RecipeStore {
  return {
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
      set(() => ({
        recipes: new Map(),
        recipeList: [],
      }));
    },
  };
}

export type RecipeStoreApi = ReturnType<typeof createRecipeStore>;

/**
 * Factory function to create the recipe store with injected storage
 * This allows React Native apps to use AsyncStorage or any other storage implementation
 *
 * @param storage - Platform storage service from DI (e.g., localStorage wrapper, AsyncStorage)
 * @param storageName - Optional custom storage key name (default: 'mixr-recipe-storage')
 * @returns Zustand store hook
 *
 * @example
 * // Web usage
 * const useRecipeStore = createRecipeStore(webStorageService);
 *
 * @example
 * // React Native usage
 * const useRecipeStore = createRecipeStore(asyncStorageService);
 */
export function createRecipeStore(storage: PlatformStorage, storageName = 'mixr-recipe-storage') {
  return create<RecipeStore>()(
    persist((set, get) => createRecipeStoreState(set, get), {
      name: storageName,
      storage: createJSONStorage(() => adaptPlatformStorage(storage), jsonStorageOptions),
    })
  );
}
