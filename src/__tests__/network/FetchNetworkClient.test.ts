/**
 * Tests for FetchNetworkClient
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FetchNetworkClient } from '../../network/FetchNetworkClient';

describe('FetchNetworkClient', () => {
  let client: FetchNetworkClient;

  beforeEach(() => {
    client = new FetchNetworkClient();
    vi.clearAllMocks();
  });

  describe('request', () => {
    it('should make a successful GET request', async () => {
      const mockData = { success: true, data: { id: 1, name: 'Test' } };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockData),
      });

      const response = await client.request('http://test.com/api/test');

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
      expect(response.success).toBe(true);
    });

    it('should handle failed requests', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      const response = await client.request('http://test.com/api/test');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(response.success).toBe(false);
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const response = await client.request('http://test.com/api/test');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(response.error).toBe('Network error');
    });
  });

  describe('get', () => {
    it('should make a GET request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: () => Promise.resolve({ data: 'test' }),
      });

      await client.get('http://test.com/api/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test.com/api/test',
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('post', () => {
    it('should make a POST request with body', async () => {
      const body = { name: 'Test' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: () => Promise.resolve({ success: true }),
      });

      await client.post('http://test.com/api/test', body);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test.com/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe('put', () => {
    it('should make a PUT request with body', async () => {
      const body = { name: 'Updated' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: () => Promise.resolve({ success: true }),
      });

      await client.put('http://test.com/api/test', body);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test.com/api/test',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe('delete', () => {
    it('should make a DELETE request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: () => Promise.resolve({ success: true }),
      });

      await client.delete('http://test.com/api/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test.com/api/test',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
