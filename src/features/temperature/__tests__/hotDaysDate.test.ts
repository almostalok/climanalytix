import { describe, it, expect } from 'vitest';
import { resolveHotDaysMapDate } from '../hotDaysUtils';

describe('Hot Days: dynamic observation map date resolution', () => {
  const hotDays = [
    { date: '2024-05-18', temperature: 41.2 },
    { date: '2024-05-19', temperature: 44.8 }, // peak heatwave day
    { date: '2024-05-20', temperature: 42.1 },
  ];

  it('selects peak temperature day when hot days exist and no explicit date is set', () => {
    const resolved = resolveHotDaysMapDate('2024-05-01', '2024-05-31', hotDays);
    expect(resolved).toBe('2024-05-19');
  });

  it('falls back to startDate when no hot days are detected', () => {
    const resolved = resolveHotDaysMapDate('2024-05-01', '2024-05-31', []);
    expect(resolved).toBe('2024-05-01');
  });

  it('respects user explicit map date selection within range', () => {
    const resolved = resolveHotDaysMapDate('2024-05-01', '2024-05-31', hotDays, '2024-05-18');
    expect(resolved).toBe('2024-05-18');
  });

  it('discards explicit date if outside active date range and defaults to peak', () => {
    const resolved = resolveHotDaysMapDate('2024-05-01', '2024-05-31', hotDays, '2024-06-15');
    expect(resolved).toBe('2024-05-19');
  });

  it('changes map date when the selected date or date range changes', () => {
    const date1 = resolveHotDaysMapDate('2023-06-01', '2023-06-30', []);
    expect(date1).toBe('2023-06-01');

    const date2 = resolveHotDaysMapDate('2024-07-01', '2024-07-31', []);
    expect(date2).toBe('2024-07-01');
    expect(date1).not.toBe(date2);
  });
});
