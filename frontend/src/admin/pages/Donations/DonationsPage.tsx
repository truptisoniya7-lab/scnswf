import { useState, useEffect } from 'react';
import { Plus, IndianRupee, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusPill } from '../../components/StatusPill';
import { ExportButton } from '../../components/ExportButton';
import { ManualDonationModal } from './ManualDonationModal';
import { DonationDetailModal } from './DonationDetailModal';
import { AdminDonation, adminApi } from '../../api/adminApi';

export default function DonationsPage() {
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [summary, setSummary] = useState<{ totalAmount: number; totalCount: number }>({
    totalAmount: 0,
    totalCount: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Modals
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<AdminDonation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.listDonations({
        status: statusFilter || undefined,
        q: search || undefined,
        page,
        pageSize,
      });
      setDonations(res.data || []);
      setTotal(res.meta?.count || 0);
      if (res.summary) {
        setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [page, statusFilter, search]);

  const columns: Column<AdminDonation>[] = [
    {
      header: 'Receipt #',
      cell: (row) => (
        <span className="font-mono text-xs text-emerald-400 font-semibold">
          {row.receipt_number || row.id.slice(0, 12)}
        </span>
      ),
    },
    {
      header: 'Donor Name',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">
            {row.donor_name || 'Anonymous Supporter'}
          </div>
          <div className="text-[11px] text-zinc-400">{row.donor_email || '—'}</div>
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: (row) => (
        <span className="font-bold text-white font-heading">
          ₹{Number(row.amount).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Method',
      cell: (row) => (
        <span className="text-zinc-300 capitalize text-xs">
          {row.method || 'Online'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusPill status={row.status} size="sm" />,
    },
    {
      header: 'Date',
      cell: (row) => (
        <span className="text-zinc-400 text-xs">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">
            Donations & Contributions
          </h2>
          <p className="text-xs text-zinc-400">
            Track charitable donations, issue manual receipts, and manage transactions
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/10 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Manual Donation</span>
        </button>
      </div>

      {/* Summary Strip (Spec section 4.4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-[rgba(110,231,183,0.18)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-400">
            <IndianRupee className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">
              Total Raised
            </div>
            <div className="text-xl font-bold text-white font-heading">
              ₹{summary.totalAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">
              Successful Transactions
            </div>
            <div className="text-xl font-bold text-white font-heading">
              {summary.totalCount} Donations
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search donor name, email, receipt #..."
        dropdowns={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setPage(1);
            },
            options: [
              { label: 'Succeeded', value: 'succeeded' },
              { label: 'Pending', value: 'pending' },
              { label: 'Refunded', value: 'refunded' },
              { label: 'Failed', value: 'failed' },
            ],
          },
        ]}
        actions={
          <ExportButton
            entity="donations"
            params={{
              status: statusFilter,
              q: search,
            }}
          />
        }
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={donations}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(row) => {
          setSelectedDonation(row);
          setIsDetailModalOpen(true);
        }}
        emptyMessage="No donation records found"
      />

      {/* Manual Donation Entry Modal */}
      <ManualDonationModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSuccess={fetchDonations}
      />

      {/* Donation Detail Modal */}
      <DonationDetailModal
        donation={selectedDonation}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={fetchDonations}
      />
    </div>
  );
}
