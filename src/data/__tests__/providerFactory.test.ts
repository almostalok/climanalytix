import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createClimateDataProvider } from '../createClimateDataProvider';
import { MockClimateDataProvider } from '../MockClimateDataProvider';
import { HttpClimateDataProvider } from '../HttpClimateDataProvider';
import { authService } from '../../features/auth/AuthService';

describe('Data Provider Architecture & Factory', () => {
  it('chooses MockClimateDataProvider when explicitly passed demo mode', () => {
    const provider = createClimateDataProvider('demo');
    expect(provider).toBeInstanceOf(MockClimateDataProvider);
  });

  it('chooses HttpClimateDataProvider when explicitly passed production mode', () => {
    const provider = createClimateDataProvider('production');
    expect(provider).toBeInstanceOf(HttpClimateDataProvider);
  });

  it('HttpClimateDataProvider sends Bearer authorization header when token is present', async () => {
    const fakeToken = 'mock_jwt_test_token_123';
    vi.spyOn(authService, 'getToken').mockReturnValue(fakeToken);

    let capturedHeaders: HeadersInit | undefined;
    let capturedUrl: string | undefined;

    const mockFetch = vi.fn().mockImplementation((url, init) => {
      capturedUrl = url;
      capturedHeaders = init?.headers;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 'ERA5', name: 'ERA5 Reanalysis' }]),
      });
    });

    vi.stubGlobal('fetch', mockFetch);

    const httpProvider = new HttpClimateDataProvider('https://api.climanalytix.test');
    const manifest = await httpProvider.getManifest();

    expect(manifest.length).toBe(1);
    expect(capturedUrl).toBe('https://api.climanalytix.test/api/manifest');
    expect(capturedHeaders).toBeDefined();
    expect((capturedHeaders as Record<string, string>)['Authorization']).toBe(`Bearer ${fakeToken}`);

    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});
