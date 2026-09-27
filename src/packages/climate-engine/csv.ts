export interface CSVColumn<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, item: T) => string | number;
}

/**
 * Generates an RFC-4180 compliant CSV string from an array of objects.
 */
export function generateCSV<T extends Record<string, any>>(
  columns: CSVColumn<T>[],
  rows: T[]
): string {
  if (!columns || columns.length === 0) return '';

  const escapeField = (val: any): string => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = columns.map((col) => escapeField(col.header)).join(',');
  const rowLines = rows.map((row) =>
    columns
      .map((col) => {
        const rawVal = col.key in row ? row[col.key] : undefined;
        const formattedVal = col.formatter ? col.formatter(rawVal, row) : rawVal;
        return escapeField(formattedVal);
      })
      .join(',')
  );

  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Triggers a browser download of the CSV data.
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  columns: CSVColumn<T>[],
  rows: T[]
): void {
  const csvContent = generateCSV(columns, rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
