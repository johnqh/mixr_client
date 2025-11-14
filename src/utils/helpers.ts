/**
 * Helper functions for MIXR API client
 */

import type { NetworkResponse } from '@sudobility/types';

/**
 * Build a complete URL from base and path
 */
export function buildUrl(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Create standard headers for requests
 */
export function createHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
}

/**
 * Handle API errors consistently
 */
export function handleApiError(response: NetworkResponse<unknown>, operation: string): Error {
  const errorMessage =
    response.error ||
    (response.data &&
    typeof response.data === 'object' &&
    'error' in response.data &&
    typeof response.data.error === 'string'
      ? response.data.error
      : undefined) ||
    `Failed to ${operation}`;
  return new Error(`${errorMessage} (status: ${response.status})`);
}
