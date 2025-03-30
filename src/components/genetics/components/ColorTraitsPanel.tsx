
import React from 'react';
import { DogGenotype } from '@/types/genetics';
import { determinePhenotype, getColorCode } from '../utils/colorUtils';

interface ColorTraitsPanelProps {
  geneticData: DogGenotype;
}

export const ColorTraitsPanel: React.FC<ColorTraitsPanelProps> = ({ geneticData }) => {
  const phenotype = determinePhenotype(
    geneticData.baseColor,
    geneticData.brownDilution,
    geneticData.dilution
  );
  
  return (
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <h3 className="text-md font-semibold mb-3">Color Genetics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Base Color (E-locus)</div>
          <div className="text-md font-medium">{geneticData.baseColor}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Brown (B-locus)</div>
          <div className="text-md font-medium">{geneticData.brownDilution}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Dilution (D-locus)</div>
          <div className="text-md font-medium">{geneticData.dilution}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Agouti (A-locus)</div>
          <div className="text-md font-medium">{geneticData.agouti}</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <div className="text-sm text-gray-500 mr-2">Phenotype (Appearance):</div>
        <div className="text-md font-medium flex items-center">
          <span
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: getColorCode(phenotype) }}
          ></span>
          {phenotype}
        </div>
      </div>
    </div>
  );
};

export default ColorTraitsPanel;
