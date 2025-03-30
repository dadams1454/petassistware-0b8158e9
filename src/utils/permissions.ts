import { UserRole } from '@/contexts/AuthProvider';

// Define the hierarchy of roles (from lowest to highest privileges)
export const ROLE_HIERARCHY: UserRole[] = ['user', 'staff', 'manager', 'admin', 'owner'];

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
    view: ['user', 'staff', 'manager', 'admin', 'owner'],
    add: ['staff', 'manager', 'admin', 'owner'],
    edit: ['staff', 'manager', 'admin', 'owner'],
    delete: ['manager', 'admin', 'owner']
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

/**
 * Check if a user has permission for a specific action on a resource
 * @param userRole The user's role
 * @param resource The resource being accessed
 * @param action The action being performed
 * @param enableLogging Whether to enable permission logging
 * @returns boolean indicating if the user has permission
 */
export const hasPermission = (
  userRole: UserRole | null, 
  resource: keyof typeof PERMISSIONS, 
  action: keyof PermissionRules = 'view',
  enableLogging: boolean = false
): boolean => {
  // Environment-aware logging flag
  const shouldLog = enableLogging || process.env.NODE_ENV === 'development';
  
  if (!userRole) {
    if (shouldLog) console.warn(`[Permission] Check failed: No user role provided for ${resource}:${action}`);
    return false;
  }
  
  const resourcePermissions = PERMISSIONS[resource];
  if (!resourcePermissions) {
    if (shouldLog) console.warn(`[Permission] Check failed: Resource "${resource}" not found in permissions configuration`);
    return false;
  }
  
  const actionPermissions = resourcePermissions[action];
  if (!actionPermissions) {
    if (shouldLog) console.warn(`[Permission] Check failed: Action "${action}" not defined for resource "${resource}"`);
    return false;
  }
  
  const hasAccess = actionPermissions.includes(userRole);
  
  if (shouldLog && !hasAccess) {
    console.warn(`[Permission] Denied: Role "${userRole}" does not have "${action}" permission for "${resource}"`);
  }
  
  return hasAccess;
};
