
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '../../form/TextInput';
import TextareaInput from '../../form/TextareaInput';
import CheckboxInput from '../../form/CheckboxInput';

interface DetailsTabProps {
  form: UseFormReturn<any>;
}

const DetailsTab = ({ form }: DetailsTabProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          form={form}
          name="microchip_number"
          label="Microchip Number"
          placeholder="Enter microchip number"
        />
        
        <TextInput
          form={form}
          name="registration_number"
          label="Registration Number"
          placeholder="Enter registration number"
        />
        
        <CheckboxInput
          form={form}
          name="pedigree"
          label="Pedigree"
        />
      </div>
      
      <TextareaInput
        form={form}
        name="notes"
        label="Notes"
        placeholder="Enter any additional notes about the dog"
      />
    </div>
  );
};

export default DetailsTab;
