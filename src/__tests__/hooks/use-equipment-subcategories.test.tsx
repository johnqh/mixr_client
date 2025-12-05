/**
 * Tests for useEquipmentSubcategories hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEquipmentSubcategories } from '../../hooks/use-equipment-subcategories';
import { MixrClient } from '../../network/mixr-client';
import type { NetworkClient } from '@sudobility/types';
import React from 'react';

describe('useEquipmentSubcategories', () => {
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

  it('should fetch equipment subcategories', async () => {
    const mockSubcategories = ['essential', 'glassware', 'garnish'];

    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: mockSubcategories },
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useEquipmentSubcategories(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockSubcategories);
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

    const { result } = renderHook(() => useEquipmentSubcategories(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
