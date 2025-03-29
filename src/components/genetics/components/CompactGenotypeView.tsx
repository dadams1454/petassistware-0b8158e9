
import React from 'react';
import { DogGenotype } from '@/types/genetics';
import { getHealthSummaryData } from '../utils/healthUtils';

interface CompactGenotypeViewProps {
  dogGenetics: DogGenotype;
}

export const CompactGenotypeView: React.FC<CompactGenotypeViewProps> = ({ dogGenetics }) => {
  const healthSummary = getHealthSummaryData(dogGenetics.healthMarkers);
  
  return (
    <div className="text-sm">
      <div className="mb-1">
        <span className="font-medium">Color:</span>{' '}
        {dogGenetics.baseColor}{' • '}
        {dogGenetics.brownDilution}{' • '}
        {dogGenetics.dilution}
      </div>
      
      <div>
        <span className="font-medium">Health:</span>{' '}
        {healthSummary.hasTests ? (
          <span>
            {healthSummary.affected.length > 0 && (
              <span className="text-red-600">
                Affected: {healthSummary.affected.join(', ')}
              </span>
            )}
            {healthSummary.affected.length > 0 && healthSummary.carriers.length > 0 && <span className="mx-1">•</span>}
            {healthSummary.carriers.length > 0 && (
              <span className="text-yellow-600">
                Carrier: {healthSummary.carriers.join(', ')}
              </span>
            )}
            {(healthSummary.affected.length > 0 || healthSummary.carriers.length > 0) && 
              healthSummary.clear.length > 0 && <span className="mx-1">•</span>}
            {healthSummary.clear.length > 0 && (
              <span className="text-green-600">
                Clear: {healthSummary.clear.length} tests
              </span>
            )}
          </span>
        ) : (
          <span className="text-gray-500 italic">No health tests recorded</span>
        )}
      </div>
    </div>
  );
};

export default CompactGenotypeView;
