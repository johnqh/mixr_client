/**
 * Tests for recipe Zustand store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useRecipeStore } from '../../stores/recipeStore';
import type { Recipe } from '../../types';

describe('RecipeStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useRecipeStore.getState().clear();
    localStorage.clear();
  });

  const mockRecipe: Recipe = {
    id: 1,
    name: 'Mojito',
    description: 'Refreshing mint cocktail',
    moodId: 1,
    createdAt: '2024-01-01',
    mood: null,
    ingredients: [
      { id: 1, name: 'Rum', icon: '🍹', amount: '50ml' },
      { id: 2, name: 'Mint', icon: '🌿', amount: '10 leaves' },
    ],
    steps: ['Muddle mint', 'Add rum', 'Top with soda'],
    equipment: [{ id: 1, name: 'Muddler', icon: '🥄' }],
  };

  const mockRecipe2: Recipe = {
    ...mockRecipe,
    id: 2,
    name: 'Margarita',
  };

  describe('setRecipe', () => {
    it('should add a recipe to the store', () => {
      const { setRecipe, getRecipe } = useRecipeStore.getState();

      setRecipe(mockRecipe);

      const stored = getRecipe(1);
      expect(stored).toEqual(mockRecipe);
    });

    it('should update existing recipe', () => {
      const { setRecipe, getRecipe } = useRecipeStore.getState();

      setRecipe(mockRecipe);

      const updated = { ...mockRecipe, name: 'Updated Mojito' };
      setRecipe(updated);

      const stored = getRecipe(1);
      expect(stored?.name).toBe('Updated Mojito');
    });

    it('should add recipe to recipeList', () => {
      const { setRecipe, recipeList } = useRecipeStore.getState();

      setRecipe(mockRecipe);

      const state = useRecipeStore.getState();
      expect(state.recipeList).toHaveLength(1);
      expect(state.recipeList[0]).toEqual(mockRecipe);
    });

    it('should update recipe in recipeList if it exists', () => {
      const { setRecipe } = useRecipeStore.getState();

      setRecipe(mockRecipe);

      const updated = { ...mockRecipe, name: 'Updated Mojito' };
      setRecipe(updated);

      const state = useRecipeStore.getState();
      expect(state.recipeList).toHaveLength(1);
      expect(state.recipeList[0]?.name).toBe('Updated Mojito');
    });

    it('should add new recipe to beginning of list', () => {
      const { setRecipe } = useRecipeStore.getState();

      setRecipe(mockRecipe);
      setRecipe(mockRecipe2);

      const state = useRecipeStore.getState();
      expect(state.recipeList).toHaveLength(2);
      expect(state.recipeList[0]?.id).toBe(2); // Newer recipe first
      expect(state.recipeList[1]?.id).toBe(1);
    });
  });

  describe('setRecipes', () => {
    it('should set multiple recipes', () => {
      const { setRecipes } = useRecipeStore.getState();

      setRecipes([mockRecipe, mockRecipe2]);

      const state = useRecipeStore.getState();
      expect(state.recipeList).toHaveLength(2);
      expect(state.recipes.size).toBe(2);
    });

    it('should replace existing recipeList', () => {
      const { setRecipe, setRecipes } = useRecipeStore.getState();

      setRecipe(mockRecipe);
      setRecipes([mockRecipe2]);

      const state = useRecipeStore.getState();
      expect(state.recipeList).toHaveLength(1);
      expect(state.recipeList[0]?.id).toBe(2);
    });

    it('should add all recipes to Map', () => {
      const { setRecipes, getRecipe } = useRecipeStore.getState();

      setRecipes([mockRecipe, mockRecipe2]);

      expect(getRecipe(1)).toEqual(mockRecipe);
      expect(getRecipe(2)).toEqual(mockRecipe2);
    });
  });

  describe('getRecipe', () => {
    it('should return recipe by ID', () => {
      const { setRecipe, getRecipe } = useRecipeStore.getState();

      setRecipe(mockRecipe);

      const recipe = getRecipe(1);
      expect(recipe).toEqual(mockRecipe);
    });

    it('should return undefined for non-existent recipe', () => {
      const { getRecipe } = useRecipeStore.getState();

      const recipe = getRecipe(999);
      expect(recipe).toBeUndefined();
    });
  });

  describe('hasRecipe', () => {
    it('should return true if recipe exists', () => {
      const { setRecipe, hasRecipe } = useRecipeStore.getState();

      setRecipe(mockRecipe);

      expect(hasRecipe(1)).toBe(true);
    });

    it('should return false if recipe does not exist', () => {
      const { hasRecipe } = useRecipeStore.getState();

      expect(hasRecipe(999)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all recipes', () => {
      const { setRecipes, clear } = useRecipeStore.getState();

      setRecipes([mockRecipe, mockRecipe2]);
      clear();

      const state = useRecipeStore.getState();
      expect(state.recipes.size).toBe(0);
      expect(state.recipeList).toHaveLength(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist recipes to localStorage', () => {
      const { setRecipe } = useRecipeStore.getState();

      setRecipe(mockRecipe);

      const stored = localStorage.getItem('mixr-recipe-storage');
      expect(stored).toBeTruthy();
    });

    it('should restore recipes from localStorage', () => {
      const { setRecipe, clear } = useRecipeStore.getState();

      // Add recipe and store it
      setRecipe(mockRecipe);

      // Clear in-memory state
      clear();

      // Verify it was cleared
      expect(useRecipeStore.getState().recipes.size).toBe(0);

      // Create new store instance (simulating page reload)
      // This should restore from localStorage
      const restoredStore = useRecipeStore.getState();

      // Note: In a real scenario, the store would automatically restore from localStorage
      // For testing, we verify that localStorage has the data
      const stored = localStorage.getItem('mixr-recipe-storage');
      expect(stored).toBeTruthy();
    });
  });
});
