import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { apiClient } from '../../api/client';

interface ExportButtonProps {
  entity: 'users' | 'applications' | 'donations';
  params?: Record<string, any>;
  label?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  entity,
  params = {},
  label = 'Export CSV',
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await apiClient.get(`/admin/export/${entity}.csv`, {
        params,
        responseType: 'blob',
      });

      // Trigger browser download
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `scnswf-${entity}-${today}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Failed to generate CSV export. Please check permissions.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(110,231,183,0.2)] bg-[rgba(10,42,26,0.6)] px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/60 hover:text-white transition-colors disabled:opacity-50"
    >
      <Download className={`h-3.5 w-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
      <span>{isExporting ? 'Exporting...' : label}</span>
    </button>
  );
};
