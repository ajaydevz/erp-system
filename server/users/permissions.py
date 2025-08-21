from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role == 'Admin'
        )


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role == 'Manager'
        )
    

class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['Admin', 'Manager']
        )
    

class IsOwnerOrAdmin(BasePermission):
    """Allow if user is viewing their own object or is Admin"""
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and (obj == request.user or request.user.role == 'Admin')
        )
