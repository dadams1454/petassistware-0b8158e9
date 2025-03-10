
import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { FollowUpItem } from '../types/followUp';

interface FollowUpStatusIconProps {
  status: FollowUpItem['status'];
}

export const FollowUpStatusIcon: React.FC<FollowUpStatusIconProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'overdue':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

