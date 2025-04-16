
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export type HintType = 'info' | 'warning' | 'success' | 'error';

export interface HintCardProps {
  type?: HintType;
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  dismissable?: boolean;
  onDismiss?: () => void;
}

export function HintCard({
  type = 'info',
  title,
  children,
  className,
  icon,
  dismissable = false,
  onDismiss,
}: HintCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className={cn('border', getTypeStyles(), className)}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">{getIcon()}</div>
          <div className="flex-1">
            {title && <h4 className="font-medium mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
          </div>
          {dismissable && onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-3 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default HintCard;
