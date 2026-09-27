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
      stats: computeStatistics(data.map((d) => d.value)),
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
      // For rainfall: total precipitation in the month/year
      // For temperature: average temperature in the month/year
      const val = isRainfall ? item.sum : item.sum / item.count;
      return {
        period: key,
        date: item.date,
        value: Math.round(val * 10) / 10,
        count: item.count,
      };
    });

  return {
    data,
    stats: computeStatistics(data.map((d) => d.value)),
  };
}

/**
 * Computes min, max, avg, total statistics over an array of numbers.
 */
export function computeStatistics(values: number[]): TrendStatistics {
  if (!values || values.length === 0) {
    return { min: 0, max: 0, avg: 0, total: 0, count: 0 };
  }

  let min = values[0];
  let max = values[0];
  let total = 0;

  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
    total += v;
  }

  const avg = total / values.length;

  return {
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    avg: Math.round(avg * 10) / 10,
    total: Math.round(total * 10) / 10,
    count: values.length,
  };
}
