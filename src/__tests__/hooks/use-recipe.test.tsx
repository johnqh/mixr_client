/**
 * Tests for useRecipe hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRecipe } from '../../hooks/use-recipe';
import { createRecipeStore } from '../../stores/recipe-store';
import { MixrClient } from '../../network/mixr-client';
import type { PlatformStorage } from '@sudobility/di';
import type { NetworkClient } from '@sudobility/types';
import type { Recipe } from '../../types';
import React from 'react';

describe('useRecipe', () => {
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

    const { result } = renderHook(() => useRecipe(mixrClient, useRecipeStore, 1), { wrapper });

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

    const { result } = renderHook(() => useRecipe(mixrClient, useRecipeStore, 1), { wrapper });

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

    const { result } = renderHook(() => useRecipe(mixrClient, useRecipeStore, 1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const store = useRecipeStore.getState();
    expect(store.getRecipe(1)).toEqual(mockRecipe);
  });

  it('should not fetch when recipeId is null', async () => {
    const { result } = renderHook(() => useRecipe(mixrClient, useRecipeStore, null), { wrapper });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe('idle');
    });

    expect(mockNetworkClient.get).not.toHaveBeenCalled();
  });
});
