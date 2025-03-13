
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import LitterDatePicker from '../LitterDatePicker';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { Separator } from '@/components/ui/separator';
import { LitterFormData } from '../../hooks/useLitterForm';

interface BreedingDetailsTabProps {
  form: UseFormReturn<LitterFormData>;
}

const BreedingDetailsTab: React.FC<BreedingDetailsTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium">Mating Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LitterDatePicker 
              form={form}
              name="first_mating_date"
              label="First Mating Date" 
            />
            
            <LitterDatePicker 
              form={form}
              name="last_mating_date"
              label="Last Mating Date" 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-medium">Breeder Information</h3>
          <TextInput 
            form={form} 
            name="kennel_name" 
            label="Kennel Name" 
            placeholder="Your registered kennel name" 
          />
        </div>
      </div>
      
      <Separator />
      
      <TextareaInput 
        form={form} 
        name="breeding_notes" 
        label="Breeding Notes" 
        placeholder="Enter any notes about the breeding process" 
      />
      
      <TextareaInput 
        form={form} 
        name="notes" 
        label="Litter Notes" 
        placeholder="Enter any general notes about this litter" 
      />

      <PhotoUpload 
        form={form} 
        name="documents_url" 
        label="Litter Documents (Health records, pedigrees, etc.)" 
      />
    </div>
  );
};

export default BreedingDetailsTab;
