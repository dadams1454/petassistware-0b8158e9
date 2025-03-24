
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '../../form/TextInput';
import TextareaInput from '../../form/TextareaInput';
import CheckboxInput from '../../form/CheckboxInput';
import SelectInput from '../../form/SelectInput';

interface DetailsTabProps {
  form: UseFormReturn<any>;
}

const DetailsTab = ({ form }: DetailsTabProps) => {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'retired', label: 'Retired' },
    { value: 'deceased', label: 'Deceased' },
    { value: 'rehomed', label: 'Rehomed' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'sold', label: 'Sold' },
  ];

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
          name="microchip_location"
          label="Microchip Location"
          placeholder="E.g., Between shoulder blades"
        />
        
        <TextInput
          form={form}
          name="registration_number"
          label="Registration Number"
          placeholder="Enter registration number"
        />
        
        <TextInput
          form={form}
          name="registration_organization"
          label="Registration Organization"
          placeholder="AKC, UKC, etc."
        />
        
        <SelectInput
          form={form}
          name="status"
          label="Status"
          options={statusOptions}
          placeholder="Select status"
        />
        
        <CheckboxInput
          form={form}
          name="pedigree"
          label="Pedigree"
        />

        <CheckboxInput
          form={form}
          name="requires_special_handling"
          label="Requires Special Handling"
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
