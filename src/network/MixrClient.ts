/**
 * MIXR API Client
 * Provides methods for interacting with all MIXR API endpoints
 */

import type { NetworkClient } from '@sudobility/types';
import type {
  AddFavoriteRequest,
  AddFavoriteResponse,
  DeleteRatingResponse,
  EquipmentListResponse,
  EquipmentResponse,
  EquipmentSubcategoriesResponse,
  EquipmentSubcategory,
  GenerateRecipeRequest,
  HealthResponse,
  IngredientListResponse,
  IngredientResponse,
  IngredientSubcategoriesResponse,
  IngredientSubcategory,
  MoodListResponse,
  MoodResponse,
  RatingAggregateResponse,
  RatingListParams,
  RecipeListResponse,
  RecipeRatingListResponse,
  RecipeRatingResponse,
  RecipeResponse,
  RemoveFavoriteResponse,
  SubmitRatingRequest,
  UpdateUserPreferencesRequest,
  UpdateUserRequest,
  UserPreferencesResponse,
  UserResponse,
  VersionResponse,
} from '../types';
import { buildUrl, createHeaders, handleApiError } from '../utils/helpers';

/**
 * Query parameters for recipe list
 */
export interface RecipeListParams {
  limit?: number;
  offset?: number;
}

/**
 * Configuration options for MixrClient
 */
export interface MixrClientConfig {
  baseUrl: string;
  networkClient: NetworkClient;
  authToken?: string;
}

/**
 * MIXR API client for cocktail recipe management
 */
export class MixrClient {
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;
  private authToken: string | undefined;

  constructor(config: MixrClientConfig);
  constructor(baseUrl: string, networkClient: NetworkClient, authToken?: string);
  constructor(
    configOrBaseUrl: MixrClientConfig | string,
    networkClient?: NetworkClient,
    authToken?: string
  ) {
    if (typeof configOrBaseUrl === 'string') {
      this.baseUrl = configOrBaseUrl;
      this.networkClient = networkClient!;
      this.authToken = authToken;
    } else {
      this.baseUrl = configOrBaseUrl.baseUrl;
      this.networkClient = configOrBaseUrl.networkClient;
      this.authToken = configOrBaseUrl.authToken;
    }
  }

  /**
   * Set or update the authentication token
   */
  setAuthToken(token: string | undefined): void {
    this.authToken = token;
  }

  /**
   * Get the current authentication token
   */
  getAuthToken(): string | undefined {
    return this.authToken;
  }

  // =============================================================================
  // HEALTH CHECK ENDPOINTS
  // =============================================================================

  /**
   * Get API version and status
   * GET /
   */
  async getVersion(): Promise<VersionResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<VersionResponse>(buildUrl(this.baseUrl, '/'), {
      headers,
    });

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get version');
    }

    return response.data;
  }

  /**
   * Health check endpoint
   * GET /health
   */
  async healthCheck(): Promise<HealthResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<HealthResponse>(
      buildUrl(this.baseUrl, '/health'),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'health check');
    }

    return response.data;
  }

  // =============================================================================
  // EQUIPMENT ENDPOINTS
  // =============================================================================

  /**
   * Get all equipment or filter by subcategory
   * GET /api/equipment?subcategory=...
   */
  async getEquipment(subcategory?: EquipmentSubcategory): Promise<EquipmentListResponse> {
    const headers = createHeaders({}, this.authToken);
    const queryParams = subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : '';

    const response = await this.networkClient.get<EquipmentListResponse>(
      buildUrl(this.baseUrl, `/api/equipment${queryParams}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get equipment');
    }

    return response.data;
  }

  /**
   * Get equipment by ID
   * GET /api/equipment/:id
   */
  async getEquipmentById(id: number): Promise<EquipmentResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<EquipmentResponse>(
      buildUrl(this.baseUrl, `/api/equipment/${id}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get equipment by id');
    }

    return response.data;
  }

  /**
   * Get equipment subcategories
   * GET /api/equipment/subcategories
   */
  async getEquipmentSubcategories(): Promise<EquipmentSubcategoriesResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<EquipmentSubcategoriesResponse>(
      buildUrl(this.baseUrl, '/api/equipment/subcategories'),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get equipment subcategories');
    }

    return response.data;
  }

  // =============================================================================
  // INGREDIENT ENDPOINTS
  // =============================================================================

  /**
   * Get all ingredients or filter by subcategory
   * GET /api/ingredients?subcategory=...
   */
  async getIngredients(subcategory?: IngredientSubcategory): Promise<IngredientListResponse> {
    const headers = createHeaders({}, this.authToken);
    const queryParams = subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : '';

    const response = await this.networkClient.get<IngredientListResponse>(
      buildUrl(this.baseUrl, `/api/ingredients${queryParams}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get ingredients');
    }

    return response.data;
  }

  /**
   * Get ingredient by ID
   * GET /api/ingredients/:id
   */
  async getIngredientById(id: number): Promise<IngredientResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<IngredientResponse>(
      buildUrl(this.baseUrl, `/api/ingredients/${id}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get ingredient by id');
    }

    return response.data;
  }

  /**
   * Get ingredient subcategories
   * GET /api/ingredients/subcategories
   */
  async getIngredientSubcategories(): Promise<IngredientSubcategoriesResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<IngredientSubcategoriesResponse>(
      buildUrl(this.baseUrl, '/api/ingredients/subcategories'),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get ingredient subcategories');
    }

    return response.data;
  }

  // =============================================================================
  // MOOD ENDPOINTS
  // =============================================================================

  /**
   * Get all moods
   * GET /api/moods
   */
  async getMoods(): Promise<MoodListResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<MoodListResponse>(
      buildUrl(this.baseUrl, '/api/moods'),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get moods');
    }

    return response.data;
  }

  /**
   * Get mood by ID
   * GET /api/moods/:id
   */
  async getMoodById(id: number): Promise<MoodResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<MoodResponse>(
      buildUrl(this.baseUrl, `/api/moods/${id}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get mood by id');
    }

    return response.data;
  }

  // =============================================================================
  // RECIPE ENDPOINTS
  // =============================================================================

  /**
   * Generate a new recipe
   * POST /api/recipes/generate
   */
  async generateRecipe(request: GenerateRecipeRequest): Promise<RecipeResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.post<RecipeResponse>(
      buildUrl(this.baseUrl, '/api/recipes/generate'),
      request,
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'generate recipe');
    }

    return response.data;
  }

  /**
   * Get all recipes (with pagination)
   * GET /api/recipes?limit=...&offset=...
   */
  async getRecipes(params?: RecipeListParams): Promise<RecipeListResponse> {
    const headers = createHeaders({}, this.authToken);
    const queryParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const path = `/api/recipes${queryString ? `?${queryString}` : ''}`;

    const response = await this.networkClient.get<RecipeListResponse>(
      buildUrl(this.baseUrl, path),
      {
        headers,
      }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get recipes');
    }

    return response.data;
  }

  /**
   * Get recipe by ID
   * GET /api/recipes/:id
   */
  async getRecipeById(id: number): Promise<RecipeResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<RecipeResponse>(
      buildUrl(this.baseUrl, `/api/recipes/${id}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get recipe by id');
    }

    return response.data;
  }

  // =============================================================================
  // USER ENDPOINTS (require authentication)
  // =============================================================================

  /**
   * Get current user's profile
   * GET /api/users/me
   * Requires authentication
   */
  async getCurrentUser(): Promise<UserResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<UserResponse>(
      buildUrl(this.baseUrl, '/api/users/me'),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get current user');
    }

    return response.data;
  }

  /**
   * Update current user's profile
   * PUT /api/users/me
   * Requires authentication
   */
  async updateCurrentUser(request: UpdateUserRequest): Promise<UserResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.put<UserResponse>(
      buildUrl(this.baseUrl, '/api/users/me'),
      request,
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'update current user');
    }

    return response.data;
  }

  /**
   * Get current user's preferences
   * GET /api/users/me/preferences
   * Requires authentication
   */
  async getUserPreferences(): Promise<UserPreferencesResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<UserPreferencesResponse>(
      buildUrl(this.baseUrl, '/api/users/me/preferences'),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get user preferences');
    }

    return response.data;
  }

  /**
   * Update current user's preferences
   * PUT /api/users/me/preferences
   * Requires authentication
   */
  async updateUserPreferences(
    request: UpdateUserPreferencesRequest
  ): Promise<UserPreferencesResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.put<UserPreferencesResponse>(
      buildUrl(this.baseUrl, '/api/users/me/preferences'),
      request,
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'update user preferences');
    }

    return response.data;
  }

  /**
   * Get recipes created by current user
   * GET /api/users/me/recipes
   * Requires authentication
   */
  async getUserRecipes(params?: RecipeListParams): Promise<RecipeListResponse> {
    const headers = createHeaders({}, this.authToken);
    const queryParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const path = `/api/users/me/recipes${queryString ? `?${queryString}` : ''}`;

    const response = await this.networkClient.get<RecipeListResponse>(
      buildUrl(this.baseUrl, path),
      {
        headers,
      }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get user recipes');
    }

    return response.data;
  }

  /**
   * Get current user's favorite recipes
   * GET /api/users/me/favorites
   * Requires authentication
   */
  async getUserFavorites(params?: RecipeListParams): Promise<RecipeListResponse> {
    const headers = createHeaders({}, this.authToken);
    const queryParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const path = `/api/users/me/favorites${queryString ? `?${queryString}` : ''}`;

    const response = await this.networkClient.get<RecipeListResponse>(
      buildUrl(this.baseUrl, path),
      {
        headers,
      }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get user favorites');
    }

    return response.data;
  }

  /**
   * Add a recipe to favorites
   * POST /api/users/me/favorites
   * Requires authentication
   */
  async addFavorite(request: AddFavoriteRequest): Promise<AddFavoriteResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.post<AddFavoriteResponse>(
      buildUrl(this.baseUrl, '/api/users/me/favorites'),
      request,
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'add favorite');
    }

    return response.data;
  }

  /**
   * Remove a recipe from favorites
   * DELETE /api/users/me/favorites/:recipeId
   * Requires authentication
   */
  async removeFavorite(recipeId: number): Promise<RemoveFavoriteResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.delete<RemoveFavoriteResponse>(
      buildUrl(this.baseUrl, `/api/users/me/favorites/${recipeId}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'remove favorite');
    }

    return response.data;
  }

  // =============================================================================
  // RECIPE RATING ENDPOINTS
  // =============================================================================

  /**
   * Submit or update a rating for a recipe
   * POST /api/recipes/:id/ratings
   * Requires authentication
   */
  async submitRecipeRating(
    recipeId: number,
    request: SubmitRatingRequest
  ): Promise<RecipeRatingResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.post<RecipeRatingResponse>(
      buildUrl(this.baseUrl, `/api/recipes/${recipeId}/ratings`),
      request,
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'submit recipe rating');
    }

    return response.data;
  }

  /**
   * Get all ratings for a recipe
   * GET /api/recipes/:id/ratings
   */
  async getRecipeRatings(
    recipeId: number,
    params?: RatingListParams
  ): Promise<RecipeRatingListResponse> {
    const headers = createHeaders({}, this.authToken);
    const queryParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.sort !== undefined) {
      queryParams.append('sort', params.sort);
    }

    const queryString = queryParams.toString();
    const path = `/api/recipes/${recipeId}/ratings${queryString ? `?${queryString}` : ''}`;

    const response = await this.networkClient.get<RecipeRatingListResponse>(
      buildUrl(this.baseUrl, path),
      {
        headers,
      }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get recipe ratings');
    }

    return response.data;
  }

  /**
   * Get aggregate rating statistics for a recipe
   * GET /api/recipes/:id/ratings/aggregate
   */
  async getRecipeRatingAggregate(recipeId: number): Promise<RatingAggregateResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.get<RatingAggregateResponse>(
      buildUrl(this.baseUrl, `/api/recipes/${recipeId}/ratings/aggregate`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get recipe rating aggregate');
    }

    return response.data;
  }

  /**
   * Delete a rating
   * DELETE /api/recipes/:recipeId/ratings/:ratingId
   * Requires authentication
   */
  async deleteRecipeRating(recipeId: number, ratingId: number): Promise<DeleteRatingResponse> {
    const headers = createHeaders({}, this.authToken);

    const response = await this.networkClient.delete<DeleteRatingResponse>(
      buildUrl(this.baseUrl, `/api/recipes/${recipeId}/ratings/${ratingId}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'delete recipe rating');
    }

    return response.data;
  }
}
