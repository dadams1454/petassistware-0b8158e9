
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
  const hasHealthMarkers = Object.keys(dogGenetics.healthMarkers).length > 0;
  
  return (
    <div className="mt-4">
      {showTitle && <h4 className="text-sm font-semibold mb-2">Health Test Results</h4>}
      
      {hasHealthMarkers ? (
        <div className="space-y-2">
          {Object.entries(dogGenetics.healthMarkers).map(([condition, data], index) => (
            <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-gray-100">
              <div className="font-medium">{formatConditionName(condition)}</div>
              <div className="flex items-center">
                <span {...getResultWithColorProps(data.status)}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {data.testDate ? formatDate(data.testDate) : ''}
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
