
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MedicationFilterProps } from '../types/medicationTypes';

const MedicationFilter: React.FC<MedicationFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Filter:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter medications" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dogs</SelectItem>
          <SelectItem value="withMeds">With Medications</SelectItem>
          <SelectItem value="withoutMeds">Without Medications</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MedicationFilter;
