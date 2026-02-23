/**
 * Tests for useMoods hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMoods } from '../../hooks/use-moods';
import { MixrClient } from '../../network/mixr-client';
import type { NetworkClient } from '@sudobility/types';
import type { Mood } from '../../types';
import React from 'react';

describe('useMoods', () => {
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

  it('should fetch all moods', async () => {
    const mockMoods: Mood[] = [
      {
        id: 1,
        emoji: '🎉',
        name: 'Festive',
        description: 'Party mood',
        exampleDrinks: 'Champagne cocktail',
        imageName: null,
        createdAt: '2024-01-01',
      },
      {
        id: 2,
        emoji: '😌',
        name: 'Relaxed',
        description: 'Chill mood',
        exampleDrinks: 'Gin and tonic',
        imageName: null,
        createdAt: '2024-01-01',
      },
    ];

    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: mockMoods, count: 2 },
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useMoods(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMoods);
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

    const { result } = renderHook(() => useMoods(mixrClient), { wrapper });

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

    const { result } = renderHook(() => useMoods(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('should call the correct API endpoint', async () => {
    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: [], count: 0 },
      timestamp: new Date().toISOString(),
    });

    renderHook(() => useMoods(mixrClient), { wrapper });

    await waitFor(() => {
      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/moods',
        expect.any(Object)
      );
    });
  });
});
