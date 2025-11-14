/**
 * Tests for recipe hooks
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRecipes, useRecipe, useCreateRecipe } from '../../hooks/useRecipes';
import { useRecipeStore } from '../../stores/recipeStore';
import { MixrClient } from '../../network/MixrClient';
import type { NetworkClient } from '@sudobility/types';
import type { Recipe } from '../../types';
import React from 'react';

describe('Recipe Hooks', () => {
  let queryClient: QueryClient;
  let mockNetworkClient: NetworkClient;
  let mixrClient: MixrClient;

  const mockRecipe: Recipe = {
    id: 1,
    name: 'Mojito',
    description: 'Refreshing mint cocktail',
    moodId: 1,
    createdAt: '2024-01-01',
    mood: null,
    ingredients: [],
    steps: [],
    equipment: [],
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    mixrClient = new MixrClient('http://localhost:3000', mockNetworkClient);

    // Clear store before each test
    useRecipeStore.getState().clear();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useRecipes', () => {
    it('should fetch recipes with pagination', async () => {
      const mockRecipes = [mockRecipe];

      vi.mocked(mockNetworkClient.get).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipes, count: 1 },
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useRecipes(mixrClient, 10), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.pages[0]?.recipes).toEqual(mockRecipes);
    });

    it('should update Zustand store when fetching recipes', async () => {
      const mockRecipes = [mockRecipe];

      vi.mocked(mockNetworkClient.get).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipes, count: 1 },
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useRecipes(mixrClient, 10), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const store = useRecipeStore.getState();
      expect(store.hasRecipe(1)).toBe(true);
    });

    it('should support pagination with fetchNextPage', async () => {
      const mockRecipes1 = [mockRecipe];
      const mockRecipes2 = [{ ...mockRecipe, id: 2, name: 'Margarita' }];

      vi.mocked(mockNetworkClient.get)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: {},
          success: true,
          data: { success: true, data: mockRecipes1, count: 1 },
          timestamp: new Date().toISOString(),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: {},
          success: true,
          data: { success: true, data: mockRecipes2, count: 1 },
          timestamp: new Date().toISOString(),
        });

      const { result } = renderHook(() => useRecipes(mixrClient, 1), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.hasNextPage).toBe(true);

      // Fetch next page
      result.current.fetchNextPage();

      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

      expect(result.current.data?.pages[0]?.recipes).toEqual(mockRecipes1);
      expect(result.current.data?.pages[1]?.recipes).toEqual(mockRecipes2);
    });
  });

  describe('useRecipe', () => {
    it('should fetch a single recipe', async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipe },
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useRecipe(mixrClient, 1), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockRecipe);
    });

    it('should return local data immediately if available', async () => {
      // Add recipe to store first
      useRecipeStore.getState().setRecipe(mockRecipe);

      vi.mocked(mockNetworkClient.get).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipe },
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useRecipe(mixrClient, 1), { wrapper });

      // Should have placeholder data immediately
      expect(result.current.data).toEqual(mockRecipe);

      // Wait for background refetch
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should update Zustand store when fetching', async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipe },
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useRecipe(mixrClient, 1), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const store = useRecipeStore.getState();
      expect(store.getRecipe(1)).toEqual(mockRecipe);
    });

    it('should not fetch when recipeId is null', () => {
      const { result } = renderHook(() => useRecipe(mixrClient, null), { wrapper });

      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockNetworkClient.get).not.toHaveBeenCalled();
    });
  });

  describe('useCreateRecipe', () => {
    it('should create a recipe', async () => {
      vi.mocked(mockNetworkClient.post).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipe },
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useCreateRecipe(mixrClient), { wrapper });

      result.current.mutate({
        equipment_ids: [1, 2],
        ingredient_ids: [1, 2, 3],
        mood_id: 1,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockRecipe);
    });

    it('should update Zustand store on success', async () => {
      vi.mocked(mockNetworkClient.post).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipe },
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useCreateRecipe(mixrClient), { wrapper });

      result.current.mutate({
        equipment_ids: [1, 2],
        ingredient_ids: [1, 2, 3],
        mood_id: 1,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const store = useRecipeStore.getState();
      expect(store.getRecipe(1)).toEqual(mockRecipe);
    });

    it('should invalidate recipe list queries on success', async () => {
      vi.mocked(mockNetworkClient.post).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        success: true,
        data: { success: true, data: mockRecipe },
        timestamp: new Date().toISOString(),
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCreateRecipe(mixrClient), { wrapper });

      result.current.mutate({
        equipment_ids: [1, 2],
        ingredient_ids: [1, 2, 3],
        mood_id: 1,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['recipes', 'list'] })
      );
    });
  });
});
