
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ActivitySquare,
  Archive 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'completed' 
  | 'error' 
  | 'warning'
  | 'archived';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label,
  className = ''
}) => {
  const config = {
    active: {
      variant: 'default',
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
      defaultLabel: 'Active'
    },
    inactive: {
      variant: 'secondary',
      icon: <XCircle className="h-3 w-3 mr-1" />,
      defaultLabel: 'Inactive'
    },
    pending: {
      variant: 'outline',
      icon: <Clock className="h-3 w-3 mr-1" />,
      defaultLabel: 'Pending'
    },
    completed: {
      variant: 'default',
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
      defaultLabel: 'Completed'
    },
    error: {
      variant: 'destructive',
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      defaultLabel: 'Error'
    },
    warning: {
      variant: 'outline',
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      defaultLabel: 'Warning'
    },
    archived: {
      variant: 'outline',
      icon: <Archive className="h-3 w-3 mr-1" />,
      defaultLabel: 'Archived'
    }
  };

  const { variant, icon, defaultLabel } = config[status];
  const displayLabel = label || defaultLabel;

  return (
    <Badge variant={variant as any} className={cn("flex items-center", className)}>
      {icon}
      {displayLabel}
    </Badge>
  );
};

export default StatusBadge;
