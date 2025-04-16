
import React from 'react';
import { cn } from "@/lib/utils";

export interface StatusIndicatorProps {
  status: string;
  label?: string;
  className?: string;
}

/**
 * A general status indicator component for showing various status types
 */
export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'confirmed':
      case 'healthy':
        return 'bg-green-500';
      case 'pending':
      case 'in_progress':
      case 'in-progress':
      case 'in_heat':
      case 'in-heat':
        return 'bg-orange-500';
      case 'completed':
      case 'resolved':
        return 'bg-blue-500';
      case 'pregnant':
        return 'bg-purple-500';
      case 'warning':
      case 'attention':
        return 'bg-yellow-500';
      case 'error':
      case 'critical':
      case 'emergency':
        return 'bg-red-600';
      case 'inactive':
      case 'archived':
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={cn("inline-flex items-center", className)}>
      <div className={cn("w-2.5 h-2.5 rounded-full mr-2", getStatusColor())} />
      {label || status}
    </div>
  );
}

export default StatusIndicator;
