
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import { Award, FileText, Fingerprint } from 'lucide-react';
import { PuppyFormData } from './types';

interface AKCRegistrationTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const AKCRegistrationTab: React.FC<AKCRegistrationTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 rounded-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-purple-700" />
          <h3 className="text-purple-800 font-medium">AKC Registration Information</h3>
        </div>
        <p className="text-sm text-purple-700">
          Record AKC registration details for this puppy to maintain compliance with AKC requirements.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">AKC Litter Registration</span>
          </div>
          <TextInput 
            form={form} 
            name="akc_litter_number" 
            label="AKC Litter Number" 
            placeholder="Enter AKC litter registration number"
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Individual Registration</span>
          </div>
          <TextInput 
            form={form} 
            name="akc_registration_number" 
            label="AKC Registration Number" 
            placeholder="Enter puppy's individual registration number"
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Fingerprint className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Identification</span>
        </div>
        <TextInput 
          form={form} 
          name="microchip_number" 
          label="Microchip Number" 
          placeholder="Enter microchip identification number if applicable"
        />
      </div>
    </div>
  );
};

export default AKCRegistrationTab;
