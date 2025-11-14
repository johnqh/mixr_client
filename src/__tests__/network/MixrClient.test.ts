/**
 * Tests for MixrClient
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MixrClient } from '../../network/MixrClient';
import type { NetworkClient, NetworkResponse } from '@sudobility/types';
import type { Equipment, Ingredient, Mood, Recipe } from '../../types';

describe('MixrClient', () => {
  let client: MixrClient;
  let mockNetworkClient: NetworkClient;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    client = new MixrClient('http://localhost:3000', mockNetworkClient);
  });

  describe('Health Check Endpoints', () => {
    it('should get version', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, message: 'API running', version: '0.0.1' },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getVersion();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should perform health check', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, status: 'healthy', timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.healthCheck();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/health',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Equipment Endpoints', () => {
    it('should get all equipment', async () => {
      const mockEquipment: Equipment[] = [
        { id: 1, subcategory: 'essential', name: 'Shaker', icon: '🍸', createdAt: '2024-01-01' },
      ];

      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockEquipment, count: 1 },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getEquipment();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/equipment',
        expect.any(Object)
      );
      expect(result.data).toEqual(mockEquipment);
    });

    it('should get equipment by subcategory', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: [], count: 0 },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getEquipment('glassware');

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/equipment?subcategory=glassware',
        expect.any(Object)
      );
    });

    it('should get equipment by ID', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: {
          success: true,
          data: { id: 1, subcategory: 'essential', name: 'Shaker', icon: '🍸', createdAt: '2024-01-01' },
        },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getEquipmentById(1);

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/equipment/1',
        expect.any(Object)
      );
    });

    it('should get equipment subcategories', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: ['essential', 'glassware'] },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getEquipmentSubcategories();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/equipment/subcategories',
        expect.any(Object)
      );
    });
  });

  describe('Ingredient Endpoints', () => {
    it('should get all ingredients', async () => {
      const mockIngredients: Ingredient[] = [
        { id: 1, subcategory: 'spirit', name: 'Vodka', icon: '🍾', createdAt: '2024-01-01' },
      ];

      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockIngredients, count: 1 },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getIngredients();

      expect(result.data).toEqual(mockIngredients);
    });

    it('should get ingredients by subcategory', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: [], count: 0 },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getIngredients('fruit');

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/ingredients?subcategory=fruit',
        expect.any(Object)
      );
    });
  });

  describe('Mood Endpoints', () => {
    it('should get all moods', async () => {
      const mockMoods: Mood[] = [
        {
          id: 1,
          emoji: '🎉',
          name: 'Festive',
          description: 'Party mood',
          exampleDrinks: 'Champagne',
          imageName: null,
          createdAt: '2024-01-01',
        },
      ];

      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockMoods, count: 1 },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getMoods();

      expect(result.data).toEqual(mockMoods);
    });

    it('should get mood by ID', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: {
          success: true,
          data: {
            id: 1,
            emoji: '🎉',
            name: 'Festive',
            description: 'Party mood',
            exampleDrinks: 'Champagne',
            imageName: null,
            createdAt: '2024-01-01',
          },
        },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getMoodById(1);

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/moods/1',
        expect.any(Object)
      );
    });
  });

  describe('Recipe Endpoints', () => {
    it('should generate a recipe', async () => {
      const mockRecipe: Recipe = {
        id: 1,
        name: 'Mojito',
        description: 'Refreshing cocktail',
        moodId: 1,
        createdAt: '2024-01-01',
        mood: null,
        ingredients: [],
        steps: [],
        equipment: [],
      };

      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipe },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.post).mockResolvedValue(mockResponse);

      const result = await client.generateRecipe({
        equipment_ids: [1, 2],
        ingredient_ids: [1, 2, 3],
        mood_id: 1,
      });

      expect(mockNetworkClient.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/recipes/generate',
        { equipment_ids: [1, 2], ingredient_ids: [1, 2, 3], mood_id: 1 },
        expect.any(Object)
      );
      expect(result.data).toEqual(mockRecipe);
    });

    it('should get recipes with pagination', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: [], count: 0 },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getRecipes({ limit: 10, offset: 20 });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/recipes?limit=10&offset=20',
        expect.any(Object)
      );
    });

    it('should get recipe by ID', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: { id: 1, name: 'Test' } },
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getRecipeById(1);

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/recipes/1',
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw error when response is not ok', async () => {
      const mockResponse: NetworkResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        success: false,
        error: 'Resource not found',
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await expect(client.getEquipmentById(999)).rejects.toThrow();
    });

    it('should throw error when data is missing', async () => {
      const mockResponse: NetworkResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await expect(client.getMoods()).rejects.toThrow();
    });
  });
});
