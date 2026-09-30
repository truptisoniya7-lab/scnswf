from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """Allows access only to authenticated super admins."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_superuser or getattr(request.user, 'role', '') == 'super_admin')
        )


class IsContentEditor(permissions.BasePermission):
    """Allows access to content editors and super admins."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return getattr(request.user, 'role', '') in ['super_admin', 'content_editor']


class IsApplicationsReviewer(permissions.BasePermission):
    """Allows access to applications reviewers and super admins."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return getattr(request.user, 'role', '') in ['super_admin', 'applications_reviewer']


class ReadOnlyOrAdmin(permissions.BasePermission):
    """Allows safe methods to everyone, but mutations only to authenticated staff/admins."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.is_superuser)
        )
