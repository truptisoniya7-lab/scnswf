import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { passwordlessAuthApi, SystemRole } from '../lib/api/auth';
import ForbiddenPage from '../admin/pages/ForbiddenPage';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function RequireRole({
  children,
  allowedRoles = ['staff', 'superadmin', 'admin', 'super_admin'],
}: RequireRoleProps) {
  const location = useLocation();
  const user = passwordlessAuthApi.getCurrentUser();

  if (!user) {
    // Redirect unauthenticated user to login with return path
    const currentPath = location.pathname + location.search;
    return <Navigate to={`/login?next=${encodeURIComponent(currentPath)}`} replace />;
  }

  // Derive systemRole
  const systemRole: SystemRole =
    user.systemRole ||
    (user.role === 'super_admin' ? 'superadmin' : user.role === 'admin' ? 'staff' : 'user');

  const hasAccess =
    allowedRoles.includes(systemRole) ||
    allowedRoles.includes(user.role) ||
    systemRole === 'superadmin';

  if (!hasAccess) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}
