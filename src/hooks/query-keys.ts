/**
 * Centralized query key definitions for TanStack Query.
 *
 * All query keys used by hooks are defined here to prevent typos,
 * make invalidation patterns discoverable, and provide a single
 * source of truth for cache key structure.
 *
 * @example
 * ```typescript
 * // Invalidate all equipment queries
 * queryClient.invalidateQueries({ queryKey: QUERY_KEYS.equipment.all });
 *
 * // Invalidate a specific recipe detail
 * queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipes.detail(42) });
 * ```
 */

import type { EquipmentSubcategory, IngredientSubcategory } from '../types';

export const QUERY_KEYS = {
  /** Equipment query keys */
  equipment: {
    /** Matches all equipment queries */
    all: ['equipment'] as const,
    /** Equipment list, optionally filtered by subcategory */
    list: (subcategory?: EquipmentSubcategory) => ['equipment', 'list', subcategory] as const,
    /** Equipment subcategory list */
    subcategories: ['equipment', 'subcategories'] as const,
  },

  /** Ingredient query keys */
  ingredients: {
    /** Matches all ingredient queries */
    all: ['ingredients'] as const,
    /** Ingredient list, optionally filtered by subcategory */
    list: (subcategory?: IngredientSubcategory) => ['ingredients', 'list', subcategory] as const,
    /** Ingredient subcategory list */
    subcategories: ['ingredients', 'subcategories'] as const,
  },

  /** Mood query keys */
  moods: {
    /** Matches all mood queries */
    all: ['moods'] as const,
    /** Mood list */
    list: ['moods', 'list'] as const,
  },

  /** Recipe query keys */
  recipes: {
    /** Matches all recipe queries */
    all: ['recipes'] as const,
    /** Paginated recipe list */
    list: (limit: number) => ['recipes', 'list', limit] as const,
    /** Single recipe detail */
    detail: (recipeId: number | null | undefined) => ['recipes', 'detail', recipeId] as const,
  },

  /** User query keys */
  user: {
    /** Matches all user queries */
    all: ['user'] as const,
    /** Current user profile */
    profile: ['user', 'profile'] as const,
    /** Current user preferences */
    preferences: ['user', 'preferences'] as const,
    /** Current user's recipes */
    recipes: ['user', 'recipes'] as const,
    /** Current user's favorites */
    favorites: ['user', 'favorites'] as const,
  },
} as const;
