import { useState, useEffect } from 'react';
import { DataTable, Column } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusPill } from '../../components/StatusPill';
import { ExportButton } from '../../components/ExportButton';
import { UserDrawer } from './UserDrawer';
import { AdminUser, adminApi } from '../../api/adminApi';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [systemRoleFilter, setSystemRoleFilter] = useState<string>('');

  // Selected user for drawer
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.listUsers({
        q: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        systemRole: systemRoleFilter || undefined,
        page,
        pageSize,
      });
      setUsers(res.data || []);
      setTotal(res.meta?.count || 0);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter, systemRoleFilter]);

  const columns: Column<AdminUser>[] = [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-900/50 text-emerald-300 font-bold text-xs border border-emerald-500/20">
            {(row.name || row.firstName || row.email)[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-white">
              {row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'User'}
            </div>
            <div className="text-[10px] text-zinc-500">ID: {row.id.slice(0, 8)}...</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      className: 'text-zinc-300',
    },
    {
      header: 'Phone',
      cell: (row) => row.phone || <span className="text-zinc-500">—</span>,
    },
    {
      header: 'Registration Role',
      cell: (row) => (
        <span className="capitalize font-medium text-emerald-400">
          {row.registrationRole || row.role}
        </span>
      ),
    },
    {
      header: 'System Role',
      cell: (row) => (
        <StatusPill status={row.systemRole || (row.role === 'super_admin' ? 'superadmin' : 'user')} size="sm" />
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusPill status={row.status || 'active'} size="sm" />,
    },
    {
      header: 'Created Date',
      cell: (row) => (
        <span className="text-zinc-400 text-xs">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">
            Platform Users
          </h2>
          <p className="text-xs text-zinc-400">
            Manage registered interns, donors, volunteers, and administrative staff
          </p>
        </div>
      </div>

      {/* Filter Bar with Search, Dropdowns, and Export Button */}
      <FilterBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search name, email, phone..."
        dropdowns={[
          {
            key: 'role',
            label: 'Role',
            value: roleFilter,
            onChange: (val) => {
              setRoleFilter(val);
              setPage(1);
            },
            options: [
              { label: 'Volunteer', value: 'volunteer' },
              { label: 'Internship', value: 'internship' },
              { label: 'Donor', value: 'donor' },
            ],
          },
          {
            key: 'systemRole',
            label: 'System Access',
            value: systemRoleFilter,
            onChange: (val) => {
              setSystemRoleFilter(val);
              setPage(1);
            },
            options: [
              { label: 'User', value: 'user' },
              { label: 'Staff', value: 'staff' },
              { label: 'Superadmin', value: 'superadmin' },
            ],
          },
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setPage(1);
            },
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Suspended', value: 'suspended' },
            ],
          },
        ]}
        actions={
          <ExportButton
            entity="users"
            params={{
              q: search,
              role: roleFilter,
              status: statusFilter,
              systemRole: systemRoleFilter,
            }}
          />
        }
      />

      {/* Users Data Table */}
      <DataTable
        columns={columns}
        data={users}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(row) => {
          setSelectedUser(row);
          setIsDrawerOpen(true);
        }}
        emptyMessage="No users found matching current filters"
      />

      {/* Detail & Action Drawer */}
      <UserDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRefresh={fetchUsers}
      />
    </div>
  );
}
