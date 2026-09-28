import { AggregationMode, TimeSeriesDataPoint, TrendDataPoint, TrendResult, TrendStatistics } from '../../types/climate';

/**
 * Calculates time series trend with daily, monthly, or yearly aggregation and summary statistics.
 */
export function calculateTrend(
  series: TimeSeriesDataPoint[],
  aggregation: AggregationMode = 'monthly'
): TrendResult {
  if (!series || series.length === 0) {
    return {
      data: [],
      stats: { min: 0, max: 0, avg: 0, total: 0, count: 0 },
    };
  }

  const isRainfall = series[0].variable === 'rainfall';

  if (aggregation === 'daily') {
    const data: TrendDataPoint[] = series.map((pt) => ({
      period: pt.date,
      date: pt.date,
      value: pt.value,
      count: 1,
    }));

    return {
      data,
      stats: computeStatistics(data.map((d) => d.value), isRainfall),
    };
  }

  // Group by month (YYYY-MM) or year (YYYY)
  const groupMap = new Map<string, { sum: number; count: number; date: string }>();

  for (const pt of series) {
    const key = aggregation === 'monthly' ? pt.date.slice(0, 7) : pt.date.slice(0, 4);
    const existing = groupMap.get(key) || { sum: 0, count: 0, date: pt.date };
    existing.sum += pt.value;
    existing.count += 1;
    groupMap.set(key, existing);
  }

  const data: TrendDataPoint[] = Array.from(groupMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, item]) => {
      // For rainfall: total rainfall in the month/year
      // For temperature: average temperature in the month/year
      const val = isRainfall ? item.sum : item.sum / item.count;
      return {
        period: key,
        date: item.date,
        value: Math.round(val * 10) / 10,
        count: item.count,
      };
    });

  // Compute statistics over the underlying daily series for authentic extremes
  return {
    data,
    stats: computeStatistics(series.map((d) => d.value), isRainfall),
  };
}

/**
 * Computes min, max, avg, (total for rainfall, stdDev for temperature) over an array of numbers.
 * Temperature deliberately does NOT calculate a cumulative total.
 */
export function computeStatistics(values: number[], isRainfall: boolean = true): TrendStatistics {
  if (!values || values.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      ...(isRainfall ? { total: 0 } : {}),
      count: 0,
    };
  }

  let min = values[0];
  let max = values[0];
  let sum = 0;

  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }

  const avg = sum / values.length;

  if (isRainfall) {
    return {
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      avg: Math.round(avg * 10) / 10,
      total: Math.round(sum * 10) / 10,
      count: values.length,
    };
  }

  // Temperature: compute standard deviation, NEVER compute cumulative total
  let varianceSum = 0;
  for (const v of values) {
    varianceSum += (v - avg) * (v - avg);
  }
  const stdDev = Math.sqrt(varianceSum / values.length);

  return {
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    avg: Math.round(avg * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    count: values.length,
  };
}
