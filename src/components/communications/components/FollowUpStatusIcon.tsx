
import React from 'react';
import { Clock, CheckCircle2, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FollowUpItem } from '@/components/communications/types/followUp';

interface FollowUpStatusIconProps {
  status: FollowUpItem['status'];
  className?: string;
}

export const FollowUpStatusIcon: React.FC<FollowUpStatusIconProps> = ({ 
  status, 
  className 
}) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className={cn("text-green-500", className)} />;
    case 'cancelled':
      return <Ban className={cn("text-gray-500", className)} />;
    case 'pending':
    default:
      return <Clock className={cn("text-amber-500", className)} />;
  }
};
