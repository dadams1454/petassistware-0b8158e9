
import React from 'react';
import { DogGenotype } from '@/types/genetics';
import { determinePhenotype } from '../utils/colorUtils';
import { getHealthSummary } from '../utils/healthUtils';

interface CompactGenotypeViewProps {
  geneticData: DogGenotype;
  showColorTraits: boolean;
  showHealthTests: boolean;
}

export const CompactGenotypeView: React.FC<CompactGenotypeViewProps> = ({
  geneticData,
  showColorTraits,
  showHealthTests
}) => {
  return (
    <div className="text-sm">
      {showColorTraits && (
        <div className="mb-2">
          <span className="font-medium">Color: </span>
          {determinePhenotype(
            geneticData.baseColor,
            geneticData.brownDilution,
            geneticData.dilution
          )}
          <span className="text-gray-500 ml-1">
            ({geneticData.baseColor}, {geneticData.brownDilution})
          </span>
        </div>
      )}
      
      {showHealthTests && Object.keys(geneticData.healthMarkers).length > 0 && (
        <div>
          <span className="font-medium">Health: </span>
          {getHealthSummary(geneticData.healthMarkers)}
        </div>
      )}
    </div>
  );
};

export default CompactGenotypeView;
