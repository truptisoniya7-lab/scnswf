import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopbar } from './components/AdminTopbar';

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Compute page title from path
  const getPageTitle = (path: string): string => {
    if (path === '/admin' || path === '/admin/') return 'Dashboard Overview';
    if (path.startsWith('/admin/users')) return 'User Accounts';
    if (path.startsWith('/admin/applications')) return 'Volunteer & Internship Applications';
    if (path.startsWith('/admin/donations')) return 'Donations & Receipts';
    if (path.startsWith('/admin/content')) return 'Website Content Management';
    if (path.startsWith('/admin/audit')) return 'Security Audit Trail';
    if (path.startsWith('/admin/settings')) return 'System Settings';
    return 'Admin Console';
  };

  const currentTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#04140c] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 min-w-0 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <AdminTopbar
          title={currentTitle}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
