
export const getUserDisplayUtils = () => {
  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'staff':
        return 'secondary';
      case 'viewer':
        return 'outline';
      case 'veterinarian':
      case 'buyer':
      default:
        return 'outline';
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (!firstName && !lastName) return '??';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return {
    getRoleBadgeVariant,
    getInitials,
  };
};
