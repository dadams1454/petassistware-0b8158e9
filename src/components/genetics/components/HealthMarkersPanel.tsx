
import React from 'react';
import { DogGenotype } from '@/types/genetics';
import { formatConditionName, getResultWithColorProps, formatDate } from '../utils/healthUtils';

interface HealthMarkersPanelProps {
  dogGenetics: DogGenotype;
  showTitle?: boolean;
}

export const HealthMarkersPanel: React.FC<HealthMarkersPanelProps> = ({ 
  dogGenetics, 
  showTitle = true 
}) => {
  const hasHealthMarkers = dogGenetics && dogGenetics.healthMarkers && Object.keys(dogGenetics.healthMarkers).length > 0;
  
  // Utility functions in case the imports fail
  const formatConditionNameFallback = (condition: string): string => {
    return condition.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
  };
  
  const getResultColorFallback = (status: string) => {
    switch (status.toLowerCase()) {
      case 'clear': return { color: 'text-green-700', bgColor: 'bg-green-100' };
      case 'carrier': return { color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
      case 'at_risk':
      case 'affected': return { color: 'text-red-700', bgColor: 'bg-red-100' };
      default: return { color: 'text-gray-700', bgColor: 'bg-gray-100' };
    }
  };
  
  const formatDateFallback = (date: string) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return date;
    }
  };
  
  // Use imported functions or fallbacks
  const formatName = formatConditionName || formatConditionNameFallback;
  const getColorProps = getResultWithColorProps || getResultColorFallback;
  const formatDateString = formatDate || formatDateFallback;
  
  return (
    <div className="mt-4">
      {showTitle && <h4 className="text-sm font-semibold mb-2">Health Test Results</h4>}
      
      {hasHealthMarkers ? (
        <div className="space-y-2">
          {Object.entries(dogGenetics.healthMarkers).map(([condition, data], index) => (
            <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-gray-100">
              <div className="font-medium">{formatName(condition)}</div>
              <div className="flex items-center">
                <span className={`px-2 py-0.5 rounded-full text-xs ${getColorProps(data.status).color} ${getColorProps(data.status).bgColor}`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {data.testDate ? formatDateString(data.testDate) : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">No health tests recorded</div>
      )}
    </div>
  );
};

export default HealthMarkersPanel;
