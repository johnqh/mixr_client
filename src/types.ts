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

/**
 * User types
 */
export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserRequest {
  display_name: string;
}

export type UserResponse = MixrApiResponse<User>;

/**
 * User preferences types
 */
export interface UserPreferences {
  equipment_ids: number[];
  ingredient_ids: number[];
  updated_at: string;
}

export interface UpdateUserPreferencesRequest {
  equipment_ids: number[];
  ingredient_ids: number[];
}

export type UserPreferencesResponse = MixrApiResponse<UserPreferences>;

/**
 * User favorites types
 */
export interface AddFavoriteRequest {
  recipe_id: number;
}

export interface AddFavoriteResponse {
  success: boolean;
  message: string;
}

export interface RemoveFavoriteResponse {
  success: boolean;
  message: string;
}

/**
 * Recipe rating types
 */
export interface RecipeRating {
  id: number;
  recipe_id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  stars: number;
  review: Optional<string>;
  created_at: string;
  updated_at: string;
}

export interface SubmitRatingRequest {
  stars: number;
  review?: string;
}

export interface RatingAggregate {
  recipe_id: number;
  average_rating: number;
  total_ratings: number;
  rating_distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export interface RatingListParams {
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
}

export type RecipeRatingResponse = MixrApiResponse<RecipeRating>;
export type RecipeRatingListResponse = MixrApiResponse<RecipeRating[]>;
export type RatingAggregateResponse = MixrApiResponse<RatingAggregate>;
export type DeleteRatingResponse = MixrApiResponse<{ message: string }>;

/**
 * Recipe userId field
 */
export interface RecipeWithUser extends Recipe {
  userId: Optional<string>;
}
