
import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { HealthWarning } from '@/types/genetics';

interface HealthWarningCardProps {
  warning: HealthWarning;
}

export const HealthWarningCard: React.FC<HealthWarningCardProps> = ({ warning }) => {
  // Helper function to get the appropriate icon and bg color based on severity/risk level
  const getSeverityInfo = (severity: string | undefined, riskLevel: string | undefined) => {
    const level = riskLevel || severity || 'medium';
    
    switch (level.toLowerCase()) {
      case 'critical':
      case 'high':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'medium':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'low':
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
    }
  };
  
  const { icon, bgColor, textColor, borderColor } = getSeverityInfo(warning.severity, warning.riskLevel);
  
  return (
    <div className={`p-3 ${bgColor} ${textColor} border ${borderColor} rounded-md flex items-start`}>
      <div className="flex-shrink-0 mr-2 mt-0.5">
        {icon}
      </div>
      
      <div className="flex-grow">
        <div className="font-medium">
          {warning.title || warning.condition || 'Health Warning'}
          {warning.affectedPercentage !== undefined && (
            <span className="ml-2 text-sm font-normal">
              ({warning.affectedPercentage}% risk)
            </span>
          )}
        </div>
        
        <p className="text-sm mt-1">{warning.description}</p>
        
        {warning.action && (
          <p className="text-sm mt-2 font-medium">
            Recommended action: {warning.action}
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthWarningCard;
