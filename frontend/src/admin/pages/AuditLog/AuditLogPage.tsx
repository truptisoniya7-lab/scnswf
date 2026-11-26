import { useState, useEffect } from 'react';
import { Shield, Eye, X } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { adminApi } from '../../api/adminApi';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  // Selected Log for detail modal
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.listAudit({
        action: actionFilter || undefined,
        entityType: entityFilter || undefined,
        page,
        pageSize,
      });
      setLogs(res.data || []);
      setTotal(res.meta?.count || 0);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, entityFilter]);

  const columns: Column<any>[] = [
    {
      header: 'Timestamp (UTC/IST)',
      cell: (row) => (
        <span className="font-mono text-xs text-zinc-300">
          {new Date(row.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Actor',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">{row.actor_email}</div>
          <div className="text-[10px] text-zinc-500 font-mono">ID: {row.actor_user_id.slice(0, 8)}...</div>
        </div>
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <span className="font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded text-xs">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Entity',
      cell: (row) => (
        <span className="text-zinc-300 text-xs font-medium">
          {row.entity_type} ({row.entity_id ? row.entity_id.slice(0, 8) : '—'})
        </span>
      ),
    },
    {
      header: '',
      className: 'w-10 text-right',
      cell: (row) => (
        <button
          onClick={() => setSelectedLog(row)}
          className="text-zinc-400 hover:text-emerald-400 p-1"
          title="Inspect Payload"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white font-heading">
            Security & Compliance Audit Trail
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Immutable log of administrative operations, role promotions, and record edits
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={actionFilter}
        onSearchChange={(val) => {
          setActionFilter(val);
          setPage(1);
        }}
        searchPlaceholder="Filter by action name (e.g. user.suspend)..."
        dropdowns={[
          {
            key: 'entity',
            label: 'Entity Type',
            value: entityFilter,
            onChange: (val) => {
              setEntityFilter(val);
              setPage(1);
            },
            options: [
              { label: 'User', value: 'User' },
              { label: 'Application', value: 'Application' },
              { label: 'Donation', value: 'Donation' },
              { label: 'Content', value: 'Content' },
            ],
          },
        ]}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={logs}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(row) => setSelectedLog(row)}
        emptyMessage="No audit records found matching criteria"
      />

      {/* Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-[rgba(110,231,183,0.2)] bg-[#071f14] shadow-2xl p-6 text-zinc-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-heading">
                  Audit Entry Details
                </h3>
                <p className="text-[11px] text-zinc-400">{selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-zinc-800 bg-[#04140c] p-3 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Actor</span>
                  <span className="font-semibold text-white">{selectedLog.actor_email}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Action</span>
                  <span className="font-semibold text-emerald-400">{selectedLog.action}</span>
                </div>
              </div>

              <div>
                <span className="text-zinc-400 font-semibold block mb-1">
                  Metadata & Event Details (JSON)
                </span>
                <pre className="rounded-lg border border-zinc-800 bg-[#04140c] p-3 font-mono text-[11px] text-zinc-300 max-h-60 overflow-y-auto">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
