import { passwordlessAuthApi } from '../../lib/api/auth';

export type Permission =
  | 'dashboard.view'
  | 'users.view'
  | 'users.edit'
  | 'users.suspend'
  | 'users.delete'
  | 'users.changeRole'
  | 'applications.view'
  | 'applications.review'
  | 'donations.view'
  | 'donations.create'
  | 'donations.edit'
  | 'content.view'
  | 'content.edit'
  | 'content.delete'
  | 'audit.view'
  | 'settings.view'
  | 'settings.edit';

export function usePermissions() {
  const user = passwordlessAuthApi.getCurrentUser();
  const systemRole =
    user?.systemRole ||
    (user?.role === 'super_admin' ? 'superadmin' : user?.role === 'admin' ? 'staff' : 'user');

  const isSuperadmin = systemRole === 'superadmin';
  const isStaff = systemRole === 'staff' || isSuperadmin;

  const can = (permission: Permission): boolean => {
    if (isSuperadmin) return true;

    if (!isStaff) return false;

    switch (permission) {
      case 'dashboard.view':
      case 'users.view':
      case 'users.edit':
      case 'users.suspend':
      case 'applications.view':
      case 'applications.review':
      case 'donations.view':
      case 'donations.create':
      case 'donations.edit':
      case 'content.view':
      case 'content.edit':
        return true;
      case 'users.delete':
      case 'users.changeRole':
      case 'content.delete':
      case 'audit.view':
      case 'settings.view':
      case 'settings.edit':
        return false;
      default:
        return false;
    }
  };

  return { can, isStaff, isSuperadmin, user, systemRole };
}
