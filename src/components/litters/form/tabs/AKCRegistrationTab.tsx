
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import LitterDatePicker from '../LitterDatePicker';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { LitterFormData } from '../../hooks/useLitterForm';

interface AKCRegistrationTabProps {
  form: UseFormReturn<LitterFormData>;
}

const AKCRegistrationTab: React.FC<AKCRegistrationTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 rounded-md p-4 mb-4">
        <h3 className="text-purple-800 font-medium">AKC Registration Information</h3>
        <p className="text-sm text-purple-700 mt-1">Enter AKC registration details for proper documentation and compliance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput 
          form={form} 
          name="akc_registration_number" 
          label="AKC Litter Registration Number" 
          placeholder="Enter official AKC litter registration number" 
        />
        
        <LitterDatePicker 
          form={form}
          name="akc_registration_date"
          label="AKC Registration Date" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput 
          form={form} 
          name="akc_litter_color" 
          label="Litter Colors/Markings" 
          placeholder="Primary colors/markings in this litter" 
        />
      </div>
      
      <PhotoUpload 
        form={form} 
        name="akc_documents_url" 
        label="AKC Registration Documents" 
      />
    </div>
  );
};

export default AKCRegistrationTab;
