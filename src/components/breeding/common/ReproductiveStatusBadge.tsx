
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ReproductiveStatusBadgeProps {
  status: string;
  className?: string;
}

export function ReproductiveStatusBadge({ status, className }: ReproductiveStatusBadgeProps) {
  let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
  let label = status;

  switch (status.toLowerCase()) {
    case 'in_heat':
    case 'in-heat':
      variant = 'destructive';
      label = 'In Heat';
      break;
    case 'pregnant':
      variant = 'secondary';
      label = 'Pregnant';
      break;
    case 'available':
      variant = 'outline';
      label = 'Available';
      break;
    case 'resting':
      variant = 'default';
      label = 'Resting';
      break;
    case 'not_breeding':
    case 'not-breeding':
      variant = 'outline';
      label = 'Not Breeding';
      break;
    case 'spayed':
    case 'neutered':
      variant = 'outline';
      label = status.charAt(0).toUpperCase() + status.slice(1);
      break;
    default:
      variant = 'outline';
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

export default ReproductiveStatusBadge;
