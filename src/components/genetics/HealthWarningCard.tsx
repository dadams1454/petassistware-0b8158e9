
import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealthWarning } from '@/types/genetics';

interface HealthWarningCardProps {
  warning: HealthWarning;
}

export const HealthWarningCard: React.FC<HealthWarningCardProps> = ({ warning }) => {
  // Get appropriate styling based on risk level
  const getWarningStyles = () => {
    switch (warning.riskLevel) {
      case 'critical':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-300',
          icon: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
        };
      case 'high':
        return {
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-300',
          icon: <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
        };
      case 'medium':
        return {
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          textColor: 'text-amber-800 dark:text-amber-300',
          icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        };
      case 'low':
      default:
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-300',
          icon: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        };
    }
  };

  const styles = getWarningStyles();
  
  return (
    <div className={cn(
      'p-3 rounded-md border text-sm flex items-start gap-2',
      styles.bgColor,
      styles.borderColor,
      styles.textColor
    )}>
      {styles.icon}
      <div>
        <div className="font-medium">{warning.condition}</div>
        <div className="text-xs mt-0.5">{warning.description}</div>
        {warning.affectedPercentage !== undefined && (
          <div className="text-xs font-medium mt-1">
            Probability of affected offspring: {warning.affectedPercentage}%
          </div>
        )}
      </div>
    </div>
  );
};
