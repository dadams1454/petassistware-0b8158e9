
import { UserRole } from '@/hooks/useMockSession';

/**
 * Resource types for permission checking
 */
export type ResourceType = 
  | 'dogs'
  | 'litters'
  | 'users'
  | 'adminSetup'
  | 'breeding'
  | 'customers'
  | 'finance'
  | 'kennel'
  | 'health'
  | 'settings';

/**
 * Action types for permission checking
 */
export type ActionType = 'view' | 'add' | 'edit' | 'delete';

/**
 * Permission matrix mapping roles to their allowed resources and actions
 */
const permissionMatrix: Record<UserRole, Record<ResourceType, ActionType[]>> = {
  admin: {
    dogs: ['view', 'add', 'edit', 'delete'],
    litters: ['view', 'add', 'edit', 'delete'],
    users: ['view', 'add', 'edit', 'delete'],
    adminSetup: ['view', 'edit'],
    breeding: ['view', 'add', 'edit', 'delete'],
    customers: ['view', 'add', 'edit', 'delete'],
    finance: ['view', 'add', 'edit', 'delete'],
    kennel: ['view', 'add', 'edit', 'delete'],
    health: ['view', 'add', 'edit', 'delete'],
    settings: ['view', 'edit']
  },
  
  manager: {
    dogs: ['view', 'add', 'edit', 'delete'],
    litters: ['view', 'add', 'edit'],
    users: ['view'],
    adminSetup: ['view'],
    breeding: ['view', 'add', 'edit'],
    customers: ['view', 'add', 'edit'],
    finance: ['view', 'add'],
    kennel: ['view', 'add', 'edit', 'delete'],
    health: ['view', 'add', 'edit'],
    settings: ['view']
  },
  
  staff: {
    dogs: ['view', 'add', 'edit'],
    litters: ['view', 'add', 'edit'],
    users: ['view'],
    adminSetup: [],
    breeding: ['view', 'add', 'edit'],
    customers: ['view', 'add'],
    finance: ['view'],
    kennel: ['view', 'add', 'edit'],
    health: ['view', 'add'],
    settings: []
  },
  
  veterinarian: {
    dogs: ['view', 'edit'],
    litters: ['view'],
    users: ['view'],
    adminSetup: [],
    breeding: ['view'],
    customers: ['view'],
    finance: [],
    kennel: ['view'],
    health: ['view', 'add', 'edit', 'delete'],
    settings: []
  },
  
  breeder: {
    dogs: ['view', 'add', 'edit'],
    litters: ['view', 'add', 'edit', 'delete'],
    users: ['view'],
    adminSetup: [],
    breeding: ['view', 'add', 'edit', 'delete'],
    customers: ['view', 'add'],
    finance: ['view'],
    kennel: ['view'],
    health: ['view', 'add'],
    settings: []
  },
  
  viewer: {
    dogs: ['view'],
    litters: ['view'],
    users: [],
    adminSetup: [],
    breeding: ['view'],
    customers: ['view'],
    finance: [],
    kennel: ['view'],
    health: ['view'],
    settings: []
  }
};

/**
 * Check if a user role has permission to perform an action on a resource
 * @param role The user's role
 * @param resource The resource being accessed
 * @param action The action being performed
 * @returns boolean indicating if the user has permission
 */
export const hasPermission = (
  role: UserRole | null | undefined,
  resource: ResourceType,
  action: ActionType
): boolean => {
  if (!role) return false;
  
  // Check if role exists in permission matrix
  if (!(role in permissionMatrix)) {
    console.warn(`Unknown role: ${role}`);
    return false;
  }
  
  // Check if resource exists for this role
  if (!(resource in permissionMatrix[role])) {
    console.warn(`Resource ${resource} not defined for role ${role}`);
    return false;
  }
  
  // Check if action is allowed for this resource
  return permissionMatrix[role][resource].includes(action);
};

/**
 * Get all permissions for a role
 * @param role The user role
 * @returns Record of resources and allowed actions
 */
export const getRolePermissions = (role: UserRole): Record<ResourceType, ActionType[]> => {
  return permissionMatrix[role] || {};
};

/**
 * Get available roles for display in UI
 */
export const getAvailableRoles = (): { value: UserRole; label: string; description: string }[] => {
  return [
    { 
      value: 'admin', 
      label: 'Administrator', 
      description: 'Full access to all features and settings' 
    },
    { 
      value: 'manager', 
      label: 'Kennel Manager', 
      description: 'Can manage dogs, litters, and staff' 
    },
    { 
      value: 'staff', 
      label: 'Staff Member', 
      description: 'Daily care and basic record keeping' 
    },
    { 
      value: 'veterinarian', 
      label: 'Veterinarian', 
      description: 'Access to health records and medical data' 
    },
    { 
      value: 'breeder', 
      label: 'Breeder', 
      description: 'Specialized in breeding and whelping' 
    },
    { 
      value: 'viewer', 
      label: 'Limited Viewer', 
      description: 'Read-only access to specific areas' 
    }
  ];
};
