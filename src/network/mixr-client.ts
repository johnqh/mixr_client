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
  PaginationQueryParams,
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
 * @deprecated Use PaginationQueryParams from @sudobility/mixr_types instead
 */
export type RecipeListParams = PaginationQueryParams;

/**
 * Configuration options for MixrClient
 */
export interface MixrClientConfig {
  baseUrl: string;
  networkClient: NetworkClient;
  authToken?: string;
}

/** HTTP method type for the internal request helper */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * MIXR API client for cocktail recipe management
 *
 * Provides type-safe methods for all MIXR API endpoints including
 * equipment, ingredients, moods, recipes, ratings, users, and favorites.
 *
 * @example
 * ```typescript
 * const client = new MixrClient({ baseUrl: 'https://api.mixr.app', networkClient });
 * const equipment = await client.getEquipment();
 * ```
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
  // PRIVATE HELPERS
  // =============================================================================

  /**
   * Build URL search params from a record of optional values.
   * Omits undefined values from the query string.
   */
  private buildQueryString(params: Record<string, string | number | undefined>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    }
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  }

  /**
   * Internal helper that sends an HTTP request, checks for errors, and returns the typed response data.
   * Eliminates duplicated error-handling boilerplate across all public methods.
   *
   * @param method - HTTP method
   * @param path - API path (appended to baseUrl)
   * @param operationName - Human-readable name used in error messages
   * @param body - Optional request body for POST/PUT
   * @returns The parsed response data
   * @throws Error if the response is not ok or data is missing
   */
  private async request<T>(
    method: HttpMethod,
    path: string,
    operationName: string,
    body?: unknown
  ): Promise<T> {
    const headers = createHeaders({}, this.authToken);
    const url = buildUrl(this.baseUrl, path);

    let response;
    switch (method) {
      case 'GET':
        response = await this.networkClient.get<T>(url, { headers });
        break;
      case 'POST':
        response = await this.networkClient.post<T>(url, body, { headers });
        break;
      case 'PUT':
        response = await this.networkClient.put<T>(url, body, { headers });
        break;
      case 'DELETE':
        response = await this.networkClient.delete<T>(url, { headers });
        break;
    }

    if (!response.ok || !response.data) {
      throw handleApiError(response, operationName);
    }

    return response.data;
  }

  // =============================================================================
  // HEALTH CHECK ENDPOINTS
  // =============================================================================

  /**
   * Get API version and status
   * GET /
   */
  async getVersion(): Promise<VersionResponse> {
    return this.request<VersionResponse>('GET', '/', 'get version');
  }

  /**
   * Health check endpoint
   * GET /health
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', '/health', 'health check');
  }

  // =============================================================================
  // EQUIPMENT ENDPOINTS
  // =============================================================================

  /**
   * Get all equipment or filter by subcategory
   * GET /api/equipment?subcategory=...
   */
  async getEquipment(subcategory?: EquipmentSubcategory): Promise<EquipmentListResponse> {
    const queryString = subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : '';
    return this.request<EquipmentListResponse>(
      'GET',
      `/api/equipment${queryString}`,
      'get equipment'
    );
  }

  /**
   * Get equipment by ID
   * GET /api/equipment/:id
   */
  async getEquipmentById(id: number): Promise<EquipmentResponse> {
    return this.request<EquipmentResponse>('GET', `/api/equipment/${id}`, 'get equipment by id');
  }

  /**
   * Get equipment subcategories
   * GET /api/equipment/subcategories
   */
  async getEquipmentSubcategories(): Promise<EquipmentSubcategoriesResponse> {
    return this.request<EquipmentSubcategoriesResponse>(
      'GET',
      '/api/equipment/subcategories',
      'get equipment subcategories'
    );
  }

  // =============================================================================
  // INGREDIENT ENDPOINTS
  // =============================================================================

  /**
   * Get all ingredients or filter by subcategory
   * GET /api/ingredients?subcategory=...
   */
  async getIngredients(subcategory?: IngredientSubcategory): Promise<IngredientListResponse> {
    const queryString = subcategory ? `?subcategory=${encodeURIComponent(subcategory)}` : '';
    return this.request<IngredientListResponse>(
      'GET',
      `/api/ingredients${queryString}`,
      'get ingredients'
    );
  }

  /**
   * Get ingredient by ID
   * GET /api/ingredients/:id
   */
  async getIngredientById(id: number): Promise<IngredientResponse> {
    return this.request<IngredientResponse>(
      'GET',
      `/api/ingredients/${id}`,
      'get ingredient by id'
    );
  }

  /**
   * Get ingredient subcategories
   * GET /api/ingredients/subcategories
   */
  async getIngredientSubcategories(): Promise<IngredientSubcategoriesResponse> {
    return this.request<IngredientSubcategoriesResponse>(
      'GET',
      '/api/ingredients/subcategories',
      'get ingredient subcategories'
    );
  }

  // =============================================================================
  // MOOD ENDPOINTS
  // =============================================================================

  /**
   * Get all moods
   * GET /api/moods
   */
  async getMoods(): Promise<MoodListResponse> {
    return this.request<MoodListResponse>('GET', '/api/moods', 'get moods');
  }

  /**
   * Get mood by ID
   * GET /api/moods/:id
   */
  async getMoodById(id: number): Promise<MoodResponse> {
    return this.request<MoodResponse>('GET', `/api/moods/${id}`, 'get mood by id');
  }

  // =============================================================================
  // RECIPE ENDPOINTS
  // =============================================================================

  /**
   * Generate a new recipe
   * POST /api/recipes/generate
   */
  async generateRecipe(request: GenerateRecipeRequest): Promise<RecipeResponse> {
    return this.request<RecipeResponse>(
      'POST',
      '/api/recipes/generate',
      'generate recipe',
      request
    );
  }

  /**
   * Get all recipes (with pagination)
   * GET /api/recipes?limit=...&offset=...
   */
  async getRecipes(params?: RecipeListParams): Promise<RecipeListResponse> {
    const qs = this.buildQueryString({
      limit: params?.limit,
      offset: params?.offset,
    });
    return this.request<RecipeListResponse>('GET', `/api/recipes${qs}`, 'get recipes');
  }

  /**
   * Get recipe by ID
   * GET /api/recipes/:id
   */
  async getRecipeById(id: number): Promise<RecipeResponse> {
    return this.request<RecipeResponse>('GET', `/api/recipes/${id}`, 'get recipe by id');
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
    return this.request<UserResponse>('GET', '/api/users/me', 'get current user');
  }

  /**
   * Update current user's profile
   * PUT /api/users/me
   * Requires authentication
   */
  async updateCurrentUser(request: UpdateUserRequest): Promise<UserResponse> {
    return this.request<UserResponse>('PUT', '/api/users/me', 'update current user', request);
  }

  /**
   * Get current user's preferences
   * GET /api/users/me/preferences
   * Requires authentication
   */
  async getUserPreferences(): Promise<UserPreferencesResponse> {
    return this.request<UserPreferencesResponse>(
      'GET',
      '/api/users/me/preferences',
      'get user preferences'
    );
  }

  /**
   * Update current user's preferences
   * PUT /api/users/me/preferences
   * Requires authentication
   */
  async updateUserPreferences(
    request: UpdateUserPreferencesRequest
  ): Promise<UserPreferencesResponse> {
    return this.request<UserPreferencesResponse>(
      'PUT',
      '/api/users/me/preferences',
      'update user preferences',
      request
    );
  }

  /**
   * Get recipes created by current user
   * GET /api/users/me/recipes
   * Requires authentication
   */
  async getUserRecipes(params?: RecipeListParams): Promise<RecipeListResponse> {
    const qs = this.buildQueryString({
      limit: params?.limit,
      offset: params?.offset,
    });
    return this.request<RecipeListResponse>(
      'GET',
      `/api/users/me/recipes${qs}`,
      'get user recipes'
    );
  }

  /**
   * Get current user's favorite recipes
   * GET /api/users/me/favorites
   * Requires authentication
   */
  async getUserFavorites(params?: RecipeListParams): Promise<RecipeListResponse> {
    const qs = this.buildQueryString({
      limit: params?.limit,
      offset: params?.offset,
    });
    return this.request<RecipeListResponse>(
      'GET',
      `/api/users/me/favorites${qs}`,
      'get user favorites'
    );
  }

  /**
   * Add a recipe to favorites
   * POST /api/users/me/favorites
   * Requires authentication
   */
  async addFavorite(request: AddFavoriteRequest): Promise<AddFavoriteResponse> {
    return this.request<AddFavoriteResponse>(
      'POST',
      '/api/users/me/favorites',
      'add favorite',
      request
    );
  }

  /**
   * Remove a recipe from favorites
   * DELETE /api/users/me/favorites/:recipeId
   * Requires authentication
   */
  async removeFavorite(recipeId: number): Promise<RemoveFavoriteResponse> {
    return this.request<RemoveFavoriteResponse>(
      'DELETE',
      `/api/users/me/favorites/${recipeId}`,
      'remove favorite'
    );
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
    return this.request<RecipeRatingResponse>(
      'POST',
      `/api/recipes/${recipeId}/ratings`,
      'submit recipe rating',
      request
    );
  }

  /**
   * Get all ratings for a recipe
   * GET /api/recipes/:id/ratings
   */
  async getRecipeRatings(
    recipeId: number,
    params?: RatingListParams
  ): Promise<RecipeRatingListResponse> {
    const qs = this.buildQueryString({
      limit: params?.limit,
      offset: params?.offset,
      sort: params?.sort,
    });
    return this.request<RecipeRatingListResponse>(
      'GET',
      `/api/recipes/${recipeId}/ratings${qs}`,
      'get recipe ratings'
    );
  }

  /**
   * Get aggregate rating statistics for a recipe
   * GET /api/recipes/:id/ratings/aggregate
   */
  async getRecipeRatingAggregate(recipeId: number): Promise<RatingAggregateResponse> {
    return this.request<RatingAggregateResponse>(
      'GET',
      `/api/recipes/${recipeId}/ratings/aggregate`,
      'get recipe rating aggregate'
    );
  }

  /**
   * Delete a rating
   * DELETE /api/recipes/:recipeId/ratings/:ratingId
   * Requires authentication
   */
  async deleteRecipeRating(recipeId: number, ratingId: number): Promise<DeleteRatingResponse> {
    return this.request<DeleteRatingResponse>(
      'DELETE',
      `/api/recipes/${recipeId}/ratings/${ratingId}`,
      'delete recipe rating'
    );
  }
}
