import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  Calendar,
  Ban,
  CheckCircle,
  Trash2,
  FileText,
  IndianRupee,
} from 'lucide-react';
import { AdminUser, adminApi } from '../../api/adminApi';
import { StatusPill } from '../../components/StatusPill';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { usePermissions } from '../../hooks/usePermissions';

interface UserDrawerProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const { isSuperadmin } = usePermissions();
  const [activeTab, setActiveTab] = useState<'profile' | 'linked'>('profile');
  const [details, setDetails] = useState<{ linkedApplications?: any; linkedDonations?: any[] } | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
    isDestructive: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: async () => {},
    isDestructive: false,
  });

  // Fetch full details when drawer opens
  React.useEffect(() => {
    if (user && isOpen) {
      setIsLoadingDetails(true);
      adminApi
        .getUser(user.id)
        .then((data) => setDetails(data))
        .catch((err) => console.error('Failed to load user details:', err))
        .finally(() => setIsLoadingDetails(false));
    } else {
      setDetails(null);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Supporter';
  const isSuspended = user.status === 'suspended';

  // Suspend / Reactivate action
  const handleToggleSuspend = () => {
    setConfirmDialog({
      isOpen: true,
      title: isSuspended ? 'Reactivate User Account' : 'Suspend User Account',
      message: isSuspended
        ? `Are you sure you want to reactivate ${fullName}? They will be able to log in again.`
        : `Are you sure you want to suspend ${fullName}? They will immediately lose access to the platform.`,
      isDestructive: !isSuspended,
      action: async () => {
        if (isSuspended) {
          await adminApi.reactivateUser(user.id);
        } else {
          await adminApi.suspendUser(user.id);
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        onRefresh();
        onClose();
      },
    });
  };

  // Change System Role action (Superadmin)
  const handleChangeRole = (newRole: 'user' | 'staff' | 'superadmin') => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update System Role',
      message: `Change ${fullName}'s access privilege to "${newRole}"?`,
      isDestructive: newRole === 'superadmin',
      action: async () => {
        await adminApi.changeSystemRole(user.id, newRole);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        onRefresh();
        onClose();
      },
    });
  };

  // Delete User action (Superadmin)
  const handleDeleteUser = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Permanently Delete User',
      message: `Are you sure you want to delete ${fullName} (${user.email})? This action cannot be undone.`,
      isDestructive: true,
      action: async () => {
        await adminApi.deleteUser(user.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        onRefresh();
        onClose();
      },
    });
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#071f14] border-l border-[rgba(110,231,183,0.18)] shadow-2xl flex flex-col text-zinc-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(110,231,183,0.14)]">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    User Details
                  </h3>
                  <p className="text-[11px] text-zinc-400">ID: {user.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-emerald-950/40 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[rgba(110,231,183,0.1)] px-6 text-xs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-3 font-semibold border-b-2 mr-6 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-emerald-400 text-emerald-300'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Profile & Role
                </button>
                <button
                  onClick={() => setActiveTab('linked')}
                  className={`py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'linked'
                      ? 'border-emerald-400 text-emerald-300'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Applications & Donations
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {activeTab === 'profile' ? (
                  <>
                    {/* User Avatar & Name */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-bold text-xl font-heading">
                        {fullName[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white font-heading">
                          {fullName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusPill status={user.status || 'active'} size="sm" />
                          <StatusPill status={user.systemRole || 'user'} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Contact & Identity Cards */}
                    <div className="rounded-xl border border-[rgba(110,231,183,0.12)] bg-[#04140c]/80 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="text-zinc-200 truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="text-zinc-200">{user.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="text-zinc-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Role Specifications */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        Role Assignments
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-zinc-800 bg-[#04140c] p-3">
                          <div className="text-[10px] text-zinc-500 uppercase">
                            Registration Role
                          </div>
                          <div className="font-semibold text-white capitalize mt-0.5">
                            {user.registrationRole || user.role}
                          </div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-[#04140c] p-3">
                          <div className="text-[10px] text-zinc-500 uppercase">
                            System Access
                          </div>
                          <div className="font-semibold text-white capitalize mt-0.5">
                            {user.systemRole || (user.role === 'super_admin' ? 'superadmin' : 'user')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* System Role Switcher (Superadmin Only) */}
                    {isSuperadmin && (
                      <div className="space-y-2 pt-2 border-t border-[rgba(110,231,183,0.1)]">
                        <h5 className="text-xs font-semibold text-zinc-300">
                          Change System Role (Superadmin)
                        </h5>
                        <div className="flex gap-2">
                          {(['user', 'staff', 'superadmin'] as const).map((r) => (
                            <button
                              key={r}
                              onClick={() => handleChangeRole(r)}
                              className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize border transition-colors ${
                                user.systemRole === r
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                                  : 'bg-[#04140c] text-zinc-400 border-zinc-800 hover:text-white'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Linked Records Tab
                  <div className="space-y-4">
                    {isLoadingDetails ? (
                      <div className="py-8 text-center text-zinc-500">
                        Loading linked activity...
                      </div>
                    ) : (
                      <>
                        {/* Applications */}
                        <div>
                          <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <FileText className="h-3.5 w-3.5" /> Applications
                          </h5>
                          {details?.linkedApplications &&
                          (details.linkedApplications.volunteer.length > 0 ||
                            details.linkedApplications.internship.length > 0) ? (
                            <div className="space-y-2">
                              {details.linkedApplications.volunteer.map((v: any) => (
                                <div
                                  key={v.id}
                                  className="rounded-lg border border-zinc-800 bg-[#04140c] p-3 flex justify-between items-center"
                                >
                                  <div>
                                    <div className="font-semibold text-white">Volunteer</div>
                                    <div className="text-[10px] text-zinc-500">
                                      {new Date(v.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <StatusPill status={v.status} size="sm" />
                                </div>
                              ))}
                              {details.linkedApplications.internship.map((i: any) => (
                                <div
                                  key={i.id}
                                  className="rounded-lg border border-zinc-800 bg-[#04140c] p-3 flex justify-between items-center"
                                >
                                  <div>
                                    <div className="font-semibold text-white">
                                      Internship ({i.area_of_interest || 'General'})
                                    </div>
                                    <div className="text-[10px] text-zinc-500">
                                      {new Date(i.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <StatusPill status={i.status} size="sm" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-zinc-500 italic">No applications submitted.</p>
                          )}
                        </div>

                        {/* Donations */}
                        <div className="pt-3 border-t border-[rgba(110,231,183,0.1)]">
                          <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <IndianRupee className="h-3.5 w-3.5" /> Donations
                          </h5>
                          {details?.linkedDonations && details.linkedDonations.length > 0 ? (
                            <div className="space-y-2">
                              {details.linkedDonations.map((d: any) => (
                                <div
                                  key={d.id}
                                  className="rounded-lg border border-zinc-800 bg-[#04140c] p-3 flex justify-between items-center"
                                >
                                  <div>
                                    <div className="font-semibold text-white">
                                      ₹{Number(d.amount).toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-[10px] text-zinc-500">
                                      {d.receipt_number || d.id} •{' '}
                                      {new Date(d.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <StatusPill status={d.status} size="sm" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-zinc-500 italic">No donations recorded.</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-[rgba(110,231,183,0.14)] bg-[#04140c] flex items-center justify-between gap-3">
                <button
                  onClick={handleToggleSuspend}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    isSuspended
                      ? 'border-emerald-700/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                      : 'border-amber-700/50 bg-amber-950/40 text-amber-400 hover:bg-amber-900/60'
                  }`}
                >
                  {isSuspended ? (
                    <>
                      <CheckCircle className="h-4 w-4" /> Reactivate User
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4" /> Suspend User
                    </>
                  )}
                </button>

                {isSuperadmin && (
                  <button
                    onClick={handleDeleteUser}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-800/50 bg-rose-950/40 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-900/60 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
