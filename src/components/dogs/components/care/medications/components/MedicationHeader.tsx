
import React from 'react';
import { MedicationHeaderProps } from '../types/medicationTypes';

const MedicationHeader: React.FC<MedicationHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300">{title}</h3>
      <p className="text-sm text-purple-600 dark:text-purple-400">
        {description}
      </p>
    </div>
  );
};

export default MedicationHeader;
