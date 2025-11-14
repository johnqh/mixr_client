/**
 * Type definitions for MIXR API
 */

import type { Optional } from '@sudobility/types';

/**
 * API Response wrapper
 */
export interface MixrApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

/**
 * Equipment types
 */
export type EquipmentSubcategory = 'essential' | 'glassware' | 'garnish' | 'advanced';

export interface Equipment {
  id: number;
  subcategory: EquipmentSubcategory;
  name: string;
  icon: Optional<string>;
  createdAt: string;
}

export type EquipmentListResponse = MixrApiResponse<Equipment[]>;
export type EquipmentResponse = MixrApiResponse<Equipment>;
export type EquipmentSubcategoriesResponse = MixrApiResponse<string[]>;

/**
 * Ingredient types
 */
export type IngredientSubcategory =
  | 'spirit'
  | 'wine'
  | 'other_alcohol'
  | 'fruit'
  | 'spice'
  | 'other';

export interface Ingredient {
  id: number;
  subcategory: IngredientSubcategory;
  name: string;
  icon: Optional<string>;
  createdAt: string;
}

export type IngredientListResponse = MixrApiResponse<Ingredient[]>;
export type IngredientResponse = MixrApiResponse<Ingredient>;
export type IngredientSubcategoriesResponse = MixrApiResponse<string[]>;

/**
 * Mood types
 */
export interface Mood {
  id: number;
  emoji: string;
  name: string;
  description: string;
  exampleDrinks: string;
  imageName: Optional<string>;
  createdAt: string;
}

export type MoodListResponse = MixrApiResponse<Mood[]>;
export type MoodResponse = MixrApiResponse<Mood>;

/**
 * Recipe types
 */
export interface RecipeIngredient {
  id: number;
  name: string;
  icon: Optional<string>;
  amount: string;
}

export interface RecipeEquipment {
  id: number;
  name: string;
  icon: Optional<string>;
}

export interface Recipe {
  id: number;
  name: string;
  description: Optional<string>;
  moodId: Optional<number>;
  createdAt: string;
  mood: Optional<Mood>;
  ingredients: RecipeIngredient[];
  steps: string[];
  equipment: RecipeEquipment[];
}

export interface GenerateRecipeRequest {
  equipment_ids: number[];
  ingredient_ids: number[];
  mood_id: number;
}

export type RecipeListResponse = MixrApiResponse<Recipe[]>;
export type RecipeResponse = MixrApiResponse<Recipe>;

/**
 * Health check response
 */
export interface HealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
}

export interface VersionResponse {
  success: boolean;
  message: string;
  version: string;
}
