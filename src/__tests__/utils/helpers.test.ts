/**
 * Tests for utility helper functions
 */

import { describe, it, expect } from 'vitest';
import { buildUrl, createHeaders, handleApiError } from '../../utils/helpers';
import type { NetworkResponse } from '@sudobility/types';

describe('Utility Helpers', () => {
  describe('buildUrl', () => {
    it('should combine base URL and path correctly', () => {
      expect(buildUrl('http://localhost:3000', '/api/test')).toBe(
        'http://localhost:3000/api/test'
      );
    });

    it('should handle base URL with trailing slash', () => {
      expect(buildUrl('http://localhost:3000/', '/api/test')).toBe(
        'http://localhost:3000/api/test'
      );
    });

    it('should handle path without leading slash', () => {
      expect(buildUrl('http://localhost:3000', 'api/test')).toBe(
        'http://localhost:3000/api/test'
      );
    });

    it('should handle both with slashes', () => {
      expect(buildUrl('http://localhost:3000/', '/api/test')).toBe(
        'http://localhost:3000/api/test'
      );
    });
  });

  describe('createHeaders', () => {
    it('should create default headers', () => {
      const headers = createHeaders();
      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should merge additional headers', () => {
      const headers = createHeaders({
        Authorization: 'Bearer token',
        'X-Custom': 'value',
      });
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'X-Custom': 'value',
      });
    });

    it('should allow overriding default headers', () => {
      const headers = createHeaders({
        'Content-Type': 'text/plain',
      });
      expect(headers).toEqual({
        'Content-Type': 'text/plain',
      });
    });
  });

  describe('handleApiError', () => {
    it('should create error from response error field', () => {
      const response: NetworkResponse<unknown> = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        success: false,
        error: 'Invalid request',
        timestamp: new Date().toISOString(),
      };

      const error = handleApiError(response, 'fetch data');
      expect(error.message).toBe('Invalid request (status: 400)');
    });

    it('should create error from data.error field', () => {
      const response: NetworkResponse<unknown> = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        success: false,
        data: { error: 'Resource not found' },
        timestamp: new Date().toISOString(),
      };

      const error = handleApiError(response, 'fetch data');
      expect(error.message).toBe('Resource not found (status: 404)');
    });

    it('should create default error message', () => {
      const response: NetworkResponse<unknown> = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        success: false,
        timestamp: new Date().toISOString(),
      };

      const error = handleApiError(response, 'fetch data');
      expect(error.message).toBe('Failed to fetch data (status: 500)');
    });

    it('should prefer response.error over data.error', () => {
      const response: NetworkResponse<unknown> = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        success: false,
        error: 'Main error',
        data: { error: 'Secondary error' },
        timestamp: new Date().toISOString(),
      };

      const error = handleApiError(response, 'fetch data');
      expect(error.message).toBe('Main error (status: 400)');
    });
  });
});
