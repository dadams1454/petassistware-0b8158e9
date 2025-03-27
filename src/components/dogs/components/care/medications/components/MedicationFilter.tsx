
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MedicationFrequency } from '@/types/medication';
import { MedicationFilterProps } from '../types/medicationTypes';

const MedicationFilter: React.FC<MedicationFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-purple-700 dark:text-purple-300">
        Filter by:
      </span>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Frequencies</SelectItem>
          <SelectItem value={MedicationFrequency.DAILY}>Daily</SelectItem>
          <SelectItem value={MedicationFrequency.WEEKLY}>Weekly</SelectItem>
          <SelectItem value={MedicationFrequency.MONTHLY}>Monthly</SelectItem>
          <SelectItem value={MedicationFrequency.QUARTERLY}>Quarterly</SelectItem>
          <SelectItem value={MedicationFrequency.ANNUAL}>Annual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MedicationFilter;
