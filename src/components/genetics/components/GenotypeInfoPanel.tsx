
import React from 'react';
import { DogGenotype } from '@/types/genetics';

interface GenotypeInfoPanelProps {
  sireGenotype: DogGenotype;
  damGenotype: DogGenotype;
}

export const GenotypeInfoPanel: React.FC<GenotypeInfoPanelProps> = ({ 
  sireGenotype, 
  damGenotype 
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold mb-2">Genotype Information</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><span className="font-semibold">Sire:</span> {sireGenotype.baseColor}, {sireGenotype.brownDilution}, {sireGenotype.dilution}</p>
        </div>
        <div>
          <p><span className="font-semibold">Dam:</span> {damGenotype.baseColor}, {damGenotype.brownDilution}, {damGenotype.dilution}</p>
        </div>
      </div>
    </div>
  );
};

export default GenotypeInfoPanel;
