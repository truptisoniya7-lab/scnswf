import React from 'react';
import { Menu, Bell, ShieldCheck } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';

interface AdminTopbarProps {
  onOpenMobile: () => void;
  title?: string;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onOpenMobile,
  title = 'Console',
}) => {
  const { user, isSuperadmin } = usePermissions();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[rgba(110,231,183,0.14)] bg-[#04140c]/90 px-4 md:px-8 backdrop-blur-md">
      {/* Left title & mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[rgba(110,231,183,0.2)] bg-[#071f14] text-zinc-300 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white font-heading tracking-wide">
            {title}
          </h1>
          <p className="hidden sm:block text-[11px] text-zinc-400">
            Suresh Chandra Nayak Social Welfare Foundation
          </p>
        </div>
      </div>

      {/* Right controls: role badge, user greeting */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="capitalize font-semibold">
            {isSuperadmin ? 'Superadmin' : 'Staff Access'}
          </span>
        </div>

        {/* Notifications mock / indicator */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(110,231,183,0.14)] bg-[#071f14] text-zinc-300 hover:text-white hover:bg-emerald-950/40 transition-colors"
          >
            <Bell className="h-4 w-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        {/* User initials chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-slate-950 font-bold text-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <span className="hidden md:inline-block text-xs font-medium text-zinc-200">
            {user?.name || user?.email}
          </span>
        </div>
      </div>
    </header>
  );
};
