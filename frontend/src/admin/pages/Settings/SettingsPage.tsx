import { useState, useEffect } from 'react';
import { Settings, Mail, Users, Plus, CheckCircle } from 'lucide-react';
import { adminApi, AdminUser } from '../../api/adminApi';
import { StatusPill } from '../../components/StatusPill';

export default function SettingsPage() {
  const [staff, setStaff] = useState<AdminUser[]>([]);

  // Promote staff modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'staff' | 'superadmin'>('staff');
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const staffData = await adminApi.listStaff();
      setStaff(staffData || []);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handlePromoteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      // Find user by email from users list
      const usersRes = await adminApi.listUsers({ q: inviteEmail.trim() });
      const targetUser = (usersRes.data || []).find(
        (u: any) => u.email.toLowerCase() === inviteEmail.trim().toLowerCase()
      );

      if (!targetUser) {
        setInviteMsg(`No existing account found with email "${inviteEmail}". They must register an account first.`);
        return;
      }

      await adminApi.changeSystemRole(targetUser.id, inviteRole);
      setInviteMsg(`Success! ${targetUser.email} has been granted ${inviteRole} privileges.`);
      setInviteEmail('');
      fetchSettings();
    } catch (err: any) {
      console.error('Failed to promote user:', err);
      setInviteMsg('Error assigning role. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white font-heading">
            System & Organization Settings
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Superadmin configuration, staff privileges, and notification parameters
        </p>
      </div>

      {/* Staff Management Section */}
      <div className="rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              Administrative Staff Accounts ({staff.length})
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Authorized personnel with access to the management console
            </p>
          </div>

          <button
            onClick={() => {
              setIsInviteOpen(true);
              setInviteMsg(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Assign Staff Privileges
          </button>
        </div>

        {/* Staff Table */}
        <div className="rounded-lg border border-zinc-800 bg-[#04140c] overflow-hidden">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#071f14] text-emerald-400/80 uppercase font-semibold border-b border-zinc-800">
              <tr>
                <th className="px-4 py-2.5">User</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">System Privilege</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-emerald-950/20">
                  <td className="px-4 py-3 font-semibold text-white">
                    {member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Admin User'}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{member.email}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={member.systemRole || (member.role === 'super_admin' ? 'superadmin' : 'staff')} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={member.status || 'active'} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Defaults */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-6 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white font-heading">
            Organization Identity
          </h3>
          <div>
            <span className="text-zinc-500 uppercase text-[10px] block">Entity Name</span>
            <span className="text-white font-medium">Suresh Chandra Nayak Social Welfare Foundation</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px] block">Headquarters</span>
            <span className="text-white font-medium">Bhubaneswar, Odisha, India</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px] block">Registration Status</span>
            <span className="text-emerald-400 font-medium">Registered NGO (12A & 80G Certified)</span>
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(110,231,183,0.14)] bg-[rgba(10,42,26,0.6)] backdrop-blur-md p-6 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-400" />
            Automated Notification Templates
          </h3>
          <p className="text-zinc-400">
            Transactional triggers enabled on the platform:
          </p>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Application Approved Notification</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Application Rejected Notification (with rationale)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Donation Confirmation & Electronic 80G Receipt</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Passwordless Login / Register OTP Dispatch</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Promote Staff Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-[rgba(110,231,183,0.2)] bg-[#071f14] shadow-2xl p-6 text-zinc-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading">
                Assign Administrative Role
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {inviteMsg && (
              <div
                className={`p-3 rounded-lg border text-xs ${
                  inviteMsg.startsWith('Success')
                    ? 'border-emerald-700/50 bg-emerald-950/40 text-emerald-300'
                    : 'border-amber-700/50 bg-amber-950/40 text-amber-300'
                }`}
              >
                {inviteMsg}
              </div>
            )}

            <form onSubmit={handlePromoteStaff} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  User Account Email *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. aditya@example.com"
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] p-2.5 text-zinc-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  System Role to Grant *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] p-2.5 text-zinc-200 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="staff">Staff (Manage users, donations, content)</option>
                  <option value="superadmin">Superadmin (Full platform control & audit logs)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
