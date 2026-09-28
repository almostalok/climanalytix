import { ClimateDataProvider } from '../types/provider';
import { MockClimateDataProvider } from './MockClimateDataProvider';
import { HttpClimateDataProvider } from './HttpClimateDataProvider';

/**
 * Factory that returns MockClimateDataProvider in demo mode (VITE_DEMO_MODE=true)
 * or HttpClimateDataProvider in production mode (VITE_DEMO_MODE=false or undefined).
 */
export function createClimateDataProvider(forceMode?: 'demo' | 'production'): ClimateDataProvider {
  const isDemo =
    forceMode === 'demo' ||
    (forceMode !== 'production' &&
      typeof import.meta !== 'undefined' &&
      import.meta.env?.VITE_DEMO_MODE === 'true');

  if (isDemo) {
    return new MockClimateDataProvider();
  }

  return new HttpClimateDataProvider();
}

// Default application singleton
export const climateDataProvider = createClimateDataProvider();
