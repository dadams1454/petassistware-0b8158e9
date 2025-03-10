
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';

interface LitterAdditionalInfoProps {
  form: UseFormReturn<any>;
}

const LitterAdditionalInfo = ({ form }: LitterAdditionalInfoProps) => {
  return (
    <>
      <TextareaInput 
        form={form} 
        name="notes" 
        label="Notes" 
        placeholder="Enter any notes about this litter" 
      />

      <PhotoUpload 
        form={form} 
        name="documents_url" 
        label="Litter Documents (Health records, pedigrees, etc.)" 
      />
    </>
  );
};

export default LitterAdditionalInfo;
