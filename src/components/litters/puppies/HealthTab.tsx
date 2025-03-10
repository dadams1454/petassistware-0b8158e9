
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import { PuppyFormData } from './types';

interface HealthTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const HealthTab: React.FC<HealthTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <TextareaInput
        form={form}
        name="deworming_dates"
        label="Deworming Dates"
        placeholder="Enter deworming dates and details (e.g., June 1 - Panacur, June 14 - Drontal)"
      />
      
      <TextareaInput
        form={form}
        name="vaccination_dates"
        label="Vaccination Dates"
        placeholder="Enter vaccination dates and details (e.g., June 28 - DHPP, July 12 - DHPP Booster)"
      />
      
      <TextareaInput
        form={form}
        name="vet_check_dates"
        label="Vet Check Dates"
        placeholder="Enter vet check dates and findings"
      />
      
      <TextareaInput
        form={form}
        name="notes"
        label="Additional Notes"
        placeholder="Any other health information or general notes about the puppy"
      />
    </div>
  );
};

export default HealthTab;
