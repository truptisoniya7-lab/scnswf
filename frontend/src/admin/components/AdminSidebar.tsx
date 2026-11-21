import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  IndianRupee,
  Layers,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { passwordlessAuthApi } from '../../lib/api/auth';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { isSuperadmin, user } = usePermissions();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Applications', path: '/admin/applications', icon: FileText },
    { label: 'Donations', path: '/admin/donations', icon: IndianRupee },
    { label: 'Content', path: '/admin/content', icon: Layers },
    ...(isSuperadmin
      ? [
          { label: 'Audit Log', path: '/admin/audit', icon: Shield },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ]
      : []),
  ];

  const handleLogout = async () => {
    await passwordlessAuthApi.logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-[rgba(110,231,183,0.14)] bg-[#04140c] transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo / Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[rgba(110,231,183,0.14)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <HeartHandshake className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-heading font-bold text-sm tracking-wide text-white">
                  SCNSWF Admin
                </span>
                <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                  Management Console
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label="Toggle sidebar collapse"
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(110,231,183,0.2)] bg-[#071f14] text-zinc-400 hover:text-white hover:bg-emerald-950 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-emerald-950/30'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0 text-emerald-400" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Bottom utility links */}
        <div className="p-3 border-t border-[rgba(110,231,183,0.14)] space-y-2">
          {/* Public site link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-emerald-950/30 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'View Public Site' : undefined}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Public Website</span>}
          </a>

          {/* User info & Logout */}
          <div
            className={`flex items-center gap-3 p-2 rounded-lg bg-[#071f14]/60 border border-[rgba(110,231,183,0.1)] ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-900/60 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <div className="text-xs font-medium text-white truncate">
                  {user?.name || user?.email}
                </div>
                <div className="text-[10px] text-emerald-400 capitalize">
                  {user?.systemRole || user?.role || 'Staff'}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-rose-400 transition-colors p-1"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
