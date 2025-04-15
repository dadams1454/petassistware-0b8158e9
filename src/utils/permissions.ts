
/**
 * Permission utility functions
 */

/**
 * Check if a user has permission for a resource action
 */
export function hasPermission(
  role: string | null | undefined,
  resource: string,
  action: string
): boolean {
  if (!role) return false;
  
  // For now, we'll implement a simple role-based permission system
  // This can be expanded later with more granular permissions
  
  // Admin role has access to everything
  if (role === 'admin' || role === 'owner') return true;
  
  // Define permission matrix
  const permissions: Record<string, Record<string, string[]>> = {
    admin: {
      dogs: ['view', 'add', 'edit', 'delete'],
      litters: ['view', 'add', 'edit', 'delete'],
      users: ['view', 'add', 'edit', 'delete'],
      adminSetup: ['view', 'edit'],
      
      // Add additional resources as needed
      breeding: ['view', 'add', 'edit', 'delete'],
      customers: ['view', 'add', 'edit', 'delete'],
      finance: ['view', 'add', 'edit', 'delete'],
      kennel: ['view', 'add', 'edit', 'delete'],
      settings: ['view', 'edit']
    },
    
    owner: {
      dogs: ['view', 'add', 'edit', 'delete'],
      litters: ['view', 'add', 'edit', 'delete'],
      users: ['view', 'add', 'edit', 'delete'],
      adminSetup: ['view', 'edit'],
      
      breeding: ['view', 'add', 'edit', 'delete'],
      customers: ['view', 'add', 'edit', 'delete'],
      finance: ['view', 'add', 'edit', 'delete'],
      kennel: ['view', 'add', 'edit', 'delete'],
      settings: ['view', 'edit']
    },
    
    manager: {
      dogs: ['view', 'add', 'edit', 'delete'],
      litters: ['view', 'add', 'edit'],
      users: ['view'],
      
      breeding: ['view', 'add', 'edit'],
      customers: ['view', 'add', 'edit'],
      finance: ['view', 'add'],
      kennel: ['view', 'add', 'edit', 'delete']
    },
    
    staff: {
      dogs: ['view', 'add', 'edit'],
      litters: ['view', 'add', 'edit'],
      users: ['view'],
      
      breeding: ['view', 'add', 'edit'],
      customers: ['view', 'add'],
      finance: ['view'],
      kennel: ['view', 'add', 'edit']
    },
    
    veterinarian: {
      dogs: ['view', 'edit'],
      litters: ['view'],
      breeding: ['view'],
      health: ['view', 'add', 'edit', 'delete']
    },
    
    viewer: {
      dogs: ['view'],
      litters: ['view'],
      breeding: ['view'],
      customers: ['view']
    }
  };
  
  // Check if role exists in permission matrix
  if (!(role in permissions)) {
    console.warn(`Unknown role: ${role}`);
    return false;
  }
  
  // Check if resource exists for this role
  if (!(resource in permissions[role])) {
    console.warn(`Resource ${resource} not defined for role ${role}`);
    return false;
  }
  
  // Check if action is allowed for this resource
  return permissions[role][resource].includes(action);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): Record<string, string[]> {
  // Default empty permissions for unknown roles
  const defaultPerms = {};
  
  // Define permission matrix (same as above)
  const permissions: Record<string, Record<string, string[]>> = {
    admin: {
      dogs: ['view', 'add', 'edit', 'delete'],
      litters: ['view', 'add', 'edit', 'delete'],
      users: ['view', 'add', 'edit', 'delete'],
      adminSetup: ['view', 'edit'],
      
      breeding: ['view', 'add', 'edit', 'delete'],
      customers: ['view', 'add', 'edit', 'delete'],
      finance: ['view', 'add', 'edit', 'delete'],
      kennel: ['view', 'add', 'edit', 'delete'],
      settings: ['view', 'edit']
    },
    
    owner: {
      dogs: ['view', 'add', 'edit', 'delete'],
      litters: ['view', 'add', 'edit', 'delete'],
      users: ['view', 'add', 'edit', 'delete'],
      adminSetup: ['view', 'edit'],
      
      breeding: ['view', 'add', 'edit', 'delete'],
      customers: ['view', 'add', 'edit', 'delete'],
      finance: ['view', 'add', 'edit', 'delete'],
      kennel: ['view', 'add', 'edit', 'delete'],
      settings: ['view', 'edit']
    },
    
    manager: {
      dogs: ['view', 'add', 'edit', 'delete'],
      litters: ['view', 'add', 'edit'],
      users: ['view'],
      
      breeding: ['view', 'add', 'edit'],
      customers: ['view', 'add', 'edit'],
      finance: ['view', 'add'],
      kennel: ['view', 'add', 'edit', 'delete']
    },
    
    staff: {
      dogs: ['view', 'add', 'edit'],
      litters: ['view', 'add', 'edit'],
      users: ['view'],
      
      breeding: ['view', 'add', 'edit'],
      customers: ['view', 'add'],
      finance: ['view'],
      kennel: ['view', 'add', 'edit']
    },
    
    veterinarian: {
      dogs: ['view', 'edit'],
      litters: ['view'],
      breeding: ['view'],
      health: ['view', 'add', 'edit', 'delete']
    },
    
    viewer: {
      dogs: ['view'],
      litters: ['view'],
      breeding: ['view'],
      customers: ['view']
    }
  };
  
  return permissions[role] || defaultPerms;
}
