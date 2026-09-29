import { ClimateDataProvider } from '../types/provider';
import { MockClimateDataProvider } from './MockClimateDataProvider';
import { HttpClimateDataProvider } from './HttpClimateDataProvider';

/**
 * Factory that returns MockClimateDataProvider in demo mode (VITE_DEMO_MODE=true)
 * or HttpClimateDataProvider in production mode (VITE_DEMO_MODE=false or undefined).
 */
export function createClimateDataProvider(forceMode?: 'demo' | 'production'): ClimateDataProvider {
  if (forceMode === 'production') {
    return new HttpClimateDataProvider();
  }

  const isExplicitProduction =
    forceMode !== 'demo' &&
    typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_DEMO_MODE === 'false';

  if (isExplicitProduction) {
    return new HttpClimateDataProvider();
  }

  return new MockClimateDataProvider();
}

// Default application singleton
export const climateDataProvider = createClimateDataProvider();
