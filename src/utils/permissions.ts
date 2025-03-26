
import { UserRole } from '@/contexts/AuthProvider';

// Define the hierarchy of roles (from lowest to highest privileges)
export const ROLE_HIERARCHY: UserRole[] = ['user', 'staff', 'manager', 'admin'];

// Check if a user's role meets the required minimum role
export const hasMinimumRole = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
};

// Define specific permissions by feature area
export interface PermissionRules {
  view: UserRole[];
  add?: UserRole[];
  edit?: UserRole[];
  delete?: UserRole[];
}

// Centralized permissions configuration
export const PERMISSIONS = {
  dogs: {
    view: ['user', 'staff', 'manager', 'admin'],
    add: ['staff', 'manager', 'admin'],
    edit: ['staff', 'manager', 'admin'],
    delete: ['manager', 'admin']
  } as PermissionRules,
  
  customers: {
    view: ['staff', 'manager', 'admin'],
    add: ['staff', 'manager', 'admin'],
    edit: ['staff', 'manager', 'admin'],
    delete: ['manager', 'admin']
  } as PermissionRules,
  
  litters: {
    view: ['staff', 'manager', 'admin'],
    add: ['manager', 'admin'],
    edit: ['manager', 'admin'],
    delete: ['admin']
  } as PermissionRules,
  
  calendar: {
    view: ['staff', 'manager', 'admin'],
    add: ['staff', 'manager', 'admin'],
    edit: ['staff', 'manager', 'admin'],
    delete: ['manager', 'admin']
  } as PermissionRules,
  
  communications: {
    view: ['manager', 'admin'],
    add: ['manager', 'admin'],
    edit: ['manager', 'admin'],
    delete: ['manager', 'admin']
  } as PermissionRules,
  
  welping: {
    view: ['manager', 'admin'],
    add: ['manager', 'admin'],
    edit: ['manager', 'admin'],
    delete: ['manager', 'admin']
  } as PermissionRules,
  
  users: {
    view: ['admin'],
    add: ['admin'],
    edit: ['admin'],
    delete: ['admin']
  } as PermissionRules,
  
  adminSetup: {
    view: ['user', 'staff', 'manager', 'admin'], // Everyone can see but functionality is limited
    edit: ['admin']
  } as PermissionRules
};

// Helper function to check if user has permission for a specific action
export const hasPermission = (
  userRole: UserRole | null, 
  resource: keyof typeof PERMISSIONS, 
  action: keyof PermissionRules = 'view'
): boolean => {
  if (!userRole) return false;
  
  const resourcePermissions = PERMISSIONS[resource];
  if (!resourcePermissions) return false;
  
  const actionPermissions = resourcePermissions[action];
  if (!actionPermissions) return false;
  
  return actionPermissions.includes(userRole);
};
