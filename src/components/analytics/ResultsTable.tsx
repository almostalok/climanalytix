import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LoadingState } from '../states/LoadingState';
import { EmptyState } from '../states/EmptyState';

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
}

interface ResultsTableProps<T extends Record<string, any>> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptySuggestions?: string[];
  maxHeight?: number | string;
}

export function ResultsTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  emptySuggestions,
  maxHeight,
}: ResultsTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortKey, sortDirection]);

  if (isLoading) {
    return <LoadingState type="table" />;
  }

  const isEmpty = !data || data.length === 0;

  return (
    <div
      className="ca-table-container"
      style={{
        maxHeight: maxHeight || 'none',
        overflowY: maxHeight ? 'auto' : 'visible',
      }}
    >
      <table className="ca-table">
        <thead>
          <tr>
            {columns.map((col, idx) => {
              const isSorted = sortKey === String(col.key);
              return (
                <th
                  key={idx}
                  style={{
                    textAlign: col.align || 'left',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      justifyContent:
                        col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
                    }}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span style={{ color: isSorted ? '#1E40AF' : '#9CA3AF' }}>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={12} />
                          ) : (
                            <ArrowDown size={12} />
                          )
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: '48px 16px',
                  color: '#6B7280',
                  fontSize: 13,
                  background: '#FFFFFF',
                }}
              >
                {emptyTitle || 'No data available'}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rIdx) => (
              <tr key={rIdx}>
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      textAlign: col.align || 'left',
                      fontFamily:
                        col.align === 'right' || String(col.key).includes('Date') || String(col.key).includes('Grid')
                          ? 'var(--font-mono)'
                          : 'inherit',
                    }}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
