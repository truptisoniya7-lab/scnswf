import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, CheckCircle, XCircle } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusPill } from '../../components/StatusPill';
import { ExportButton } from '../../components/ExportButton';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { AdminApplication, adminApi } from '../../api/adminApi';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'volunteer' | 'internship'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Selected item for modal
  const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.listApplications({
        type: activeTab === 'all' ? undefined : activeTab,
        status: statusFilter || undefined,
        q: search || undefined,
        page,
        pageSize,
      });
      setApplications(res.data || []);
      setTotal(res.meta?.count || 0);
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, activeTab, statusFilter, search]);

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm(
      `Are you sure you want to ${action} ${selectedIds.length} applications?`
    );
    if (!confirm) return;

    try {
      await adminApi.bulkApplications(selectedIds, action);
      fetchApplications();
    } catch (err) {
      console.error('Bulk action failed:', err);
      alert('Failed to update applications.');
    }
  };

  const columns: Column<AdminApplication>[] = [
    {
      header: (
        <button
          onClick={toggleSelectAll}
          className="text-zinc-400 hover:text-white p-1"
          title="Select all on this page"
        >
          {selectedIds.length > 0 && selectedIds.length === applications.length ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
      ) as unknown as string,
      className: 'w-10 px-2',
      cell: (row) => (
        <button
          onClick={(e) => toggleSelectOne(row.id, e)}
          className="text-zinc-400 hover:text-white p-1"
        >
          {selectedIds.includes(row.id) ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
      ),
    },
    {
      header: 'Applicant',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">{row.applicantName}</div>
          <div className="text-[11px] text-zinc-400">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      cell: (row) => (
        <span className="capitalize font-medium text-emerald-400">
          {row.type}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusPill status={row.status} size="sm" />,
    },
    {
      header: 'Submitted',
      cell: (row) => (
        <span className="text-zinc-400 text-xs">
          {new Date(row.submittedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Reviewer',
      cell: (row) => (
        <span className="text-zinc-400 text-xs">
          {row.reviewerId || <span className="text-zinc-600">—</span>}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">
            Applications Review
          </h2>
          <p className="text-xs text-zinc-400">
            Review and manage incoming volunteer and internship submissions
          </p>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-[#071f14] p-1.5 rounded-lg border border-[rgba(110,231,183,0.2)] text-xs">
            <span className="text-zinc-300 font-semibold px-2">
              {selectedIds.length} Selected
            </span>
            <button
              onClick={() => handleBulkAction('approve')}
              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-white hover:bg-emerald-500 font-semibold"
            >
              <CheckCircle className="h-3 w-3" /> Approve All
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              className="inline-flex items-center gap-1 rounded bg-rose-600 px-2.5 py-1 text-white hover:bg-rose-500 font-semibold"
            >
              <XCircle className="h-3 w-3" /> Reject All
            </button>
          </div>
        )}
      </div>

      {/* Tabs Strip */}
      <div className="flex border-b border-[rgba(110,231,183,0.12)] gap-4 text-xs font-semibold">
        {(['all', 'volunteer', 'internship'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`pb-3 capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-emerald-400 text-emerald-300'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Applications' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search applicant name, email..."
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
              { label: 'Pending', value: 'pending' },
              { label: 'Under Review', value: 'under_review' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ],
          },
        ]}
        actions={
          <ExportButton
            entity="applications"
            params={{
              type: activeTab === 'all' ? undefined : activeTab,
              status: statusFilter,
              q: search,
            }}
          />
        }
      />

      {/* Applications Table */}
      <DataTable
        columns={columns}
        data={applications}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(row) => {
          setSelectedApp(row);
          setIsModalOpen(true);
        }}
        emptyMessage="No applications found matching the selected filters"
      />

      {/* Detail Modal */}
      <ApplicationDetailModal
        application={selectedApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchApplications}
      />
    </div>
  );
}
