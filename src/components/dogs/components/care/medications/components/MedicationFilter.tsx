
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationFilterProps } from '../types/medicationTypes';

const MedicationFilter: React.FC<MedicationFilterProps> = ({ 
  activeFilter, 
  onChange, 
  counts,
  value  // For backward compatibility
}) => {
  // Use either activeFilter or value (for backward compatibility)
  const currentFilter = value || activeFilter;
  
  return (
    <Tabs value={currentFilter} onValueChange={onChange} className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="all">
          All ({counts.all})
        </TabsTrigger>
        <TabsTrigger value="preventative">
          Preventative ({counts.preventative})
        </TabsTrigger>
        <TabsTrigger value="other">
          Other ({counts.other})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default MedicationFilter;
