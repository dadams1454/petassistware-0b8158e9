
import React from 'react';
import { HealthWarning } from '@/types/genetics';

interface HealthWarningCardProps {
  warning: HealthWarning;
}

export const HealthWarningCard: React.FC<HealthWarningCardProps> = ({ warning }) => {
  // Get appropriate styling based on risk level
  const { bgColor, textColor, borderColor, icon } = getRiskLevelStyles(warning.riskLevel);
  
  return (
    <div className={`${bgColor} ${textColor} rounded-md border ${borderColor} p-3`}>
      <div className="flex items-start">
        {/* Warning Icon */}
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        
        {/* Warning Content */}
        <div className="flex-1">
          <h5 className="font-bold text-sm">{warning.condition}</h5>
          <p className="text-sm mt-1">{warning.description}</p>
          
          {/* Affected Percentage (if provided) */}
          {warning.affectedPercentage !== undefined && (
            <div className="mt-2">
              <div className="text-xs font-medium mb-1">
                Risk of affected offspring: {warning.affectedPercentage}%
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getPercentageBarColor(warning.riskLevel)}`}
                  style={{ width: `${warning.affectedPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get styling based on risk level
function getRiskLevelStyles(riskLevel: 'low' | 'medium' | 'high' | 'critical') {
  switch (riskLevel) {
    case 'low':
      return {
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      };
    case 'medium':
      return {
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      };
    case 'high':
      return {
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      };
    case 'critical':
      return {
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      };
  }
}

// Helper function to get appropriate color for percentage bar
function getPercentageBarColor(riskLevel: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (riskLevel) {
    case 'low':
      return 'bg-blue-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-orange-500';
    case 'critical':
      return 'bg-red-500';
  }
}

export default HealthWarningCard;
