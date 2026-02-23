/**
 * Tests for useCreateRecipe hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateRecipe } from '../../hooks/use-create-recipe';
import { createRecipeStore } from '../../stores/recipe-store';
import { MixrClient } from '../../network/mixr-client';
import type { PlatformStorage } from '@sudobility/di';
import type { NetworkClient } from '@sudobility/types';
import type { Recipe } from '../../types';
import React from 'react';

describe('useCreateRecipe', () => {
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

    const { result } = renderHook(() => useCreateRecipe(mixrClient, useRecipeStore), { wrapper });

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

    const { result } = renderHook(() => useCreateRecipe(mixrClient, useRecipeStore), { wrapper });

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

    const { result } = renderHook(() => useCreateRecipe(mixrClient, useRecipeStore), { wrapper });

    result.current.mutate({
      equipment_ids: [1, 2],
      ingredient_ids: [1, 2, 3],
      mood_id: 1,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['recipes'] })
    );
  });
});
