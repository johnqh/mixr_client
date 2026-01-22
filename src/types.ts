/**
 * Type definitions for MIXR API
 * Re-exports all types from @sudobility/mixr_types
 */

// Re-export all types from the shared types package
export type {
  // Common types from @sudobility/types
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  PaginatedResponse,
  PaginationInfo,
  PaginationOptions,

  // Enum types
  EquipmentSubcategory,
  IngredientSubcategory,

  // API Response wrapper
  MixrApiResponse,

  // Entity types
  Equipment,
  Ingredient,
  Mood,
  User,
  UserPreferences,
  RecipeIngredient,
  RecipeEquipment,
  Recipe,
  RecipeWithUser,
  RecipeRating,
  RatingAggregate,

  // Request types
  UpdateUserRequest,
  UpdateUserPreferencesRequest,
  AddFavoriteRequest,
  SubmitRatingRequest,
  GenerateRecipeRequest,

  // Query param types
  EquipmentQueryParams,
  IngredientQueryParams,
  PaginationQueryParams,
  RatingListParams,

  // Response types
  EquipmentListResponse,
  EquipmentResponse,
  EquipmentSubcategoriesResponse,
  IngredientListResponse,
  IngredientResponse,
  IngredientSubcategoriesResponse,
  MoodListResponse,
  MoodResponse,
  RecipeListResponse,
  RecipeResponse,
  UserResponse,
  UserPreferencesResponse,
  AddFavoriteResponse,
  RemoveFavoriteResponse,
  RecipeRatingResponse,
  RecipeRatingListResponse,
  RatingAggregateResponse,
  DeleteRatingResponse,
  HealthResponse,
  VersionResponse,
} from '@sudobility/mixr_types';

// Re-export constants
export { EQUIPMENT_SUBCATEGORIES, INGREDIENT_SUBCATEGORIES } from '@sudobility/mixr_types';
