/**
 * Tests for useEquipments hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEquipments } from '../../hooks/use-equipments';
import { MixrClient } from '../../network/mixr-client';
import type { NetworkClient } from '@sudobility/types';
import type { Equipment } from '../../types';
import React from 'react';

describe('useEquipments', () => {
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

  it('should fetch all equipment', async () => {
    const mockEquipment: Equipment[] = [
      { id: 1, subcategory: 'essential', name: 'Shaker', icon: '🍸', createdAt: '2024-01-01' },
      { id: 2, subcategory: 'glassware', name: 'Glass', icon: '🥃', createdAt: '2024-01-01' },
    ];

    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: mockEquipment, count: 2 },
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useEquipments(mixrClient), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockEquipment);
  });

  it('should fetch equipment by subcategory', async () => {
    const mockEquipment: Equipment[] = [
      { id: 1, subcategory: 'essential', name: 'Shaker', icon: '🍸', createdAt: '2024-01-01' },
    ];

    vi.mocked(mockNetworkClient.get).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      success: true,
      data: { success: true, data: mockEquipment, count: 1 },
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useEquipments(mixrClient, 'essential'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockEquipment);
    expect(mockNetworkClient.get).toHaveBeenCalledWith(
      expect.stringContaining('subcategory=essential'),
      expect.any(Object)
    );
  });
});
