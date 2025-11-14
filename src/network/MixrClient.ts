/**
 * MIXR API Client
 * Provides methods for interacting with all MIXR API endpoints
 */

import type { NetworkClient } from '@sudobility/types';
import type {
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
  RecipeListResponse,
  RecipeResponse,
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
 * MIXR API client for cocktail recipe management
 */
export class MixrClient {
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;

  constructor(baseUrl: string, networkClient: NetworkClient) {
    this.baseUrl = baseUrl;
    this.networkClient = networkClient;
  }

  // =============================================================================
  // HEALTH CHECK ENDPOINTS
  // =============================================================================

  /**
   * Get API version and status
   * GET /
   */
  async getVersion(): Promise<VersionResponse> {
    const headers = createHeaders();

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
    const headers = createHeaders();

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
    const headers = createHeaders();
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
    const headers = createHeaders();

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
    const headers = createHeaders();

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
    const headers = createHeaders();
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
    const headers = createHeaders();

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
    const headers = createHeaders();

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
    const headers = createHeaders();

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
    const headers = createHeaders();

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
    const headers = createHeaders();

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
    const headers = createHeaders();
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
    const headers = createHeaders();

    const response = await this.networkClient.get<RecipeResponse>(
      buildUrl(this.baseUrl, `/api/recipes/${id}`),
      { headers }
    );

    if (!response.ok || !response.data) {
      throw handleApiError(response, 'get recipe by id');
    }

    return response.data;
  }
}
