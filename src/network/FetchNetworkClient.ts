/**
 * Fetch-based implementation of NetworkClient
 */

import type {
  NetworkClient,
  NetworkResponse,
  NetworkRequestOptions,
  Optional,
} from '@sudobility/types';

export class FetchNetworkClient implements NetworkClient {
  async get<T>(
    url: string,
    options?: Optional<Omit<NetworkRequestOptions, 'method' | 'body'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(
    url: string,
    body?: Optional<unknown>,
    options?: Optional<Omit<NetworkRequestOptions, 'method'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    url: string,
    body?: Optional<unknown>,
    options?: Optional<Omit<NetworkRequestOptions, 'method'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    url: string,
    options?: Optional<Omit<NetworkRequestOptions, 'method' | 'body'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  async request<T>(
    url: string,
    options?: Optional<NetworkRequestOptions>
  ): Promise<NetworkResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      const fetchOptions: RequestInit = {
        method: options?.method || 'GET',
        headers,
      };

      // Only add body if it's defined
      if (options?.body !== undefined && options?.body !== null) {
        fetchOptions.body = options.body;
      }

      // Only add signal if it's defined
      if (options?.signal !== undefined && options?.signal !== null) {
        fetchOptions.signal = options.signal;
      }

      const response = await fetch(url, fetchOptions);

      const headersRecord: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headersRecord[key] = value;
      });

      const data = await response.json();

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: headersRecord,
        success: response.ok,
        data: data as T,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Network request failed',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
