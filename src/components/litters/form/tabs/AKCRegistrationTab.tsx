
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import LitterDatePicker from '../LitterDatePicker';
import { LitterFormData } from '../../hooks/useLitterForm';
import { Switch } from '@/components/ui/switch';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';

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
        
        <FormField
          control={form.control}
          name="akc_verified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  AKC Verified
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Mark if this litter's AKC registration has been verified
                </div>
              </div>
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AKCRegistrationTab;
