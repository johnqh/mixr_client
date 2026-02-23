/**
 * Tests for useIngredients hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIngredients } from '../../hooks/use-ingredients';
import { MixrClient } from '../../network/mixr-client';
import type { NetworkClient } from '@sudobility/types';
import type { Ingredient } from '../../types';
import React from 'react';

describe('useIngredients', () => {
  let queryClient: QueryClient;
  let mockNetworkClient: NetworkClient;
  let mixrClient: MixrClient;

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
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch all ingredients', async () => {
    const mockIngredients: Ingredient[] = [
      { id: 1, subcategory: 'spirit', name: 'Vodka', icon: '🍾', createdAt: '2024-01-01' },
      { id: 2, subcategory: 'fruit', name: 'Lime', icon: '🍋', createdAt: '2024-01-01' },
    ];

    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: mockIngredients, count: 2 },
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useIngredients(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockIngredients);
  });

  it('should fetch ingredients by subcategory', async () => {
    const mockIngredients: Ingredient[] = [
      { id: 1, subcategory: 'spirit', name: 'Vodka', icon: '🍾', createdAt: '2024-01-01' },
    ];

    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: mockIngredients, count: 1 },
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useIngredients(mixrClient, 'spirit'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockIngredients);
    expect(mockNetworkClient.get).toHaveBeenCalledWith(
      expect.stringContaining('subcategory=spirit'),
      expect.any(Object)
    );
  });

  it('should handle errors', async () => {
    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      success: false,
      error: 'Server error',
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useIngredients(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('should return empty array when data is null', async () => {
    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: null, count: 0 },
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useIngredients(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });
});
