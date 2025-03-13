
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import { Award } from 'lucide-react';
import { PuppyFormData } from './types';

interface AKCRegistrationTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const AKCRegistrationTab: React.FC<AKCRegistrationTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium">AKC Registration</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput 
          form={form} 
          name="akc_litter_number" 
          label="AKC Litter Number" 
        />
        
        <TextInput 
          form={form} 
          name="akc_registration_number" 
          label="AKC Registration Number" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput 
          form={form} 
          name="microchip_number" 
          label="Microchip Number" 
        />
      </div>
    </div>
  );
};

export default AKCRegistrationTab;
