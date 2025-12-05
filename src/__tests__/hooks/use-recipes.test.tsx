/**
 * Tests for useRecipes hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRecipes } from '../../hooks/use-recipes';
import { createRecipeStore } from '../../stores/recipe-store';
import { MixrClient } from '../../network/mixr-client';
import type { PlatformStorage } from '@sudobility/di';
import type { NetworkClient } from '@sudobility/types';
import type { Recipe } from '../../types';
import React from 'react';

describe('useRecipes', () => {
  let queryClient: QueryClient;
  let mockNetworkClient: NetworkClient;
  let mixrClient: MixrClient;
  let mockStorage: PlatformStorage;
  let useRecipeStore: ReturnType<typeof createRecipeStore>;

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

    // Create mock storage
    const store: Record<string, string> = {};
    mockStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) {
          delete store[key];
        }
      },
    };

    // Create recipe store with mock storage
    useRecipeStore = createRecipeStore(mockStorage, 'test-recipe-storage');
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

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

    const { result } = renderHook(() => useRecipes(mixrClient, useRecipeStore, 10), { wrapper });

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

    const { result } = renderHook(() => useRecipes(mixrClient, useRecipeStore, 10), { wrapper });

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

    const { result } = renderHook(() => useRecipes(mixrClient, useRecipeStore, 1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(true);

    // Fetch next page
    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(result.current.data?.pages[0]?.recipes).toEqual(mockRecipes1);
    expect(result.current.data?.pages[1]?.recipes).toEqual(mockRecipes2);
  });
});
