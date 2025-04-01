
import { UserRole } from '@/contexts/AuthProvider';

// Define role hierarchy
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'guest': 0,
  'buyer': 1,
  'user': 2,
  'staff': 3,
  'veterinarian': 4,
  'manager': 5,
  'admin': 6,
  'owner': 7
};

// Define permissions for each resource
export const PERMISSIONS: {
  [key in 'dogs' | 'litters' | 'users' | 'adminSetup']: {
    [key in 'view' | 'add' | 'edit' | 'delete']?: string[]
  }
} = {
  dogs: {
    view: ['user', 'staff', 'manager', 'admin', 'owner', 'veterinarian', 'buyer'],
    add: ['staff', 'manager', 'admin', 'owner'],
    edit: ['staff', 'manager', 'admin', 'owner'],
    delete: ['manager', 'admin', 'owner']
  },
  litters: {
    view: ['user', 'staff', 'manager', 'admin', 'owner', 'veterinarian', 'buyer'],
    add: ['staff', 'manager', 'admin', 'owner'],
    edit: ['staff', 'manager', 'admin', 'owner'],
    delete: ['manager', 'admin', 'owner']
  },
  users: {
    view: ['manager', 'admin', 'owner'],
    add: ['admin', 'owner'],
    edit: ['admin', 'owner'],
    delete: ['admin', 'owner']
  },
  adminSetup: {
    view: ['admin', 'owner'],
    edit: ['admin', 'owner']
  }
};

// Check if a user has minimum role level
export const hasMinimumRole = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Check if a user has permission for a specific action on a resource
export const hasPermission = (
  userRole: UserRole | null, 
  resource: keyof typeof PERMISSIONS, 
  action: 'view' | 'add' | 'edit' | 'delete'
): boolean => {
  if (!userRole) return false;
  
  // Admin and owner have access to everything
  if (userRole === 'admin' || userRole === 'owner') return true;
  
  // Check if the resource exists in permissions
  if (!PERMISSIONS[resource]) {
    console.warn(`Resource '${resource}' not found in permissions`);
    return false;
  }
  
  // Check if the action exists for this resource
  if (!PERMISSIONS[resource][action]) {
    console.warn(`Action '${action}' not found for resource '${resource}'`);
    return false;
  }
  
  // Check if the user's role is in the list of allowed roles for this action on this resource
  return PERMISSIONS[resource][action]?.includes(userRole) || false;
};

export default {
  hasMinimumRole,
  hasPermission,
  PERMISSIONS
};
