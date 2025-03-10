
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';

interface LitterBasicInfoProps {
  form: UseFormReturn<any>;
}

const LitterBasicInfo = ({ form }: LitterBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TextInput 
        form={form} 
        name="litter_name" 
        label="Litter Name/ID" 
        placeholder="Enter a name or ID for this litter" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput 
          form={form} 
          name="puppy_count" 
          label="Total Puppies" 
          placeholder="Number of puppies" 
        />
        <div className="grid grid-cols-2 gap-2">
          <TextInput 
            form={form} 
            name="male_count" 
            label="Males" 
            placeholder="Male count" 
          />
          <TextInput 
            form={form} 
            name="female_count" 
            label="Females" 
            placeholder="Female count" 
          />
        </div>
      </div>
    </div>
  );
};

export default LitterBasicInfo;
