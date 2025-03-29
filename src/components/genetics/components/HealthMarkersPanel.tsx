
import React from 'react';
import { DogGenotype } from '@/types/genetics';
import { getStatusColor, formatConditionName, capitalizeFirst } from '../utils/healthUtils';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface HealthMarkersPanelProps {
  geneticData: DogGenotype;
}

export const HealthMarkersPanel: React.FC<HealthMarkersPanelProps> = ({ geneticData }) => {
  return (
    <div className="p-4">
      <h3 className="text-md font-semibold mb-3">Health Markers</h3>
      
      {Object.keys(geneticData.healthMarkers).length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(geneticData.healthMarkers).map(([condition, data]) => (
            <div key={condition} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(data.status)}`}
              ></div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {formatConditionName(condition)}
                </div>
                <div className="text-xs text-gray-500">
                  {capitalizeFirst(data.status)} ({data.genotype})
                  {data.testDate && ` • ${formatDateForDisplay(data.testDate)}`}
                  {data.labName && ` • ${data.labName}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm italic">
          No health tests recorded yet.
        </div>
      )}
    </div>
  );
};

export default HealthMarkersPanel;
