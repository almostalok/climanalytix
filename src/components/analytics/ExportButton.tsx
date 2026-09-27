import React from 'react';
import { Download } from 'lucide-react';
import { CSVColumn, exportToCSV } from '../../packages/climate-engine/csv';

interface ExportButtonProps<T extends Record<string, any>> {
  filename: string;
  columns: CSVColumn<T>[];
  data: T[];
  disabled?: boolean;
}

export function ExportButton<T extends Record<string, any>>({
  filename,
  columns,
  data,
  disabled = false,
}: ExportButtonProps<T>) {
  const handleExport = () => {
    if (!data || data.length === 0) return;
    exportToCSV(filename, columns, data);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className="ca-btn ca-btn-secondary ca-btn-sm"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        opacity: disabled || !data || data.length === 0 ? 0.5 : 1,
      }}
      title="Export results table to RFC-4180 CSV"
    >
      <Download size={14} />
      <span>Download CSV</span>
    </button>
  );
}
