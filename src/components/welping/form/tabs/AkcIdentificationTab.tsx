
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import { WelpingPuppyFormData } from '../hooks/useWelpingPuppyForm';

interface AkcIdentificationTabProps {
  form: UseFormReturn<WelpingPuppyFormData>;
}

const AkcIdentificationTab: React.FC<AkcIdentificationTabProps> = ({ form }) => {
  return (
    <>
      <div className="rounded-md bg-purple-50 p-4 mb-4">
        <h3 className="font-medium text-purple-800 mb-2">AKC Compliance Information</h3>
        <p className="text-sm text-purple-700">Record identification numbers for AKC registration and compliance tracking.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <TextInput
          form={form}
          name="akc_litter_number"
          label="AKC Litter Number"
          placeholder="Enter AKC litter registration number"
        />
        
        <TextInput
          form={form}
          name="akc_registration_number"
          label="AKC Registration Number"
          placeholder="Enter individual puppy registration number (if available)"
        />
        
        <TextInput
          form={form}
          name="microchip_number"
          label="Microchip ID Number"
          placeholder="Enter microchip number (if microchipped)"
        />
      </div>
    </>
  );
};

export default AkcIdentificationTab;
