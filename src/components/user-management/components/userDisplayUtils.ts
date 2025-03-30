
export const getUserDisplayUtils = () => {
  const getInitials = (firstName?: string | null, lastName?: string | null): string => {
    if (!firstName && !lastName) return 'U';
    
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    
    return firstInitial + lastInitial || firstInitial || 'U';
  };

  const getRoleBadgeVariant = (role?: string | null) => {
    if (!role) return 'secondary';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'staff':
        return 'blue';
      case 'veterinarian':
        return 'green';
      case 'buyer':
        return 'amber';
      case 'inactive':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role?: string | null): string => {
    if (!role) return 'No Role';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      case 'staff':
        return 'Staff';
      case 'veterinarian':
        return 'Veterinarian';
      case 'buyer':
        return 'Buyer/Client';
      case 'inactive':
        return 'Inactive';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return {
    getInitials,
    getRoleBadgeVariant,
    getRoleLabel
  };
};
