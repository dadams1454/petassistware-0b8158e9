
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import DogSelector from './DogSelector';

interface LitterParentsProps {
  form: UseFormReturn<any>;
}

const LitterParents = ({ form }: LitterParentsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DogSelector 
        form={form} 
        name="dam_id" 
        label="Dam (Mother)" 
        filterGender="Female" 
      />
      
      <DogSelector 
        form={form} 
        name="sire_id" 
        label="Sire (Father)" 
        filterGender="Male" 
      />
    </div>
  );
};

export default LitterParents;
