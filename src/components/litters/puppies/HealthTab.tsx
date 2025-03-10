
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import { PlusCircle, Syringe, Stethoscope, FileText } from 'lucide-react';
import { PuppyFormData } from './types';

interface HealthTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const HealthTab: React.FC<HealthTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <PlusCircle className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Deworming</h3>
      </div>
      <TextareaInput
        form={form}
        name="deworming_dates"
        label="Deworming Dates"
        placeholder="Enter deworming dates and details (e.g., June 1 - Panacur, June 14 - Drontal)"
      />
      
      <div className="flex items-center gap-2 mb-1 mt-4">
        <Syringe className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Vaccinations</h3>
      </div>
      <TextareaInput
        form={form}
        name="vaccination_dates"
        label="Vaccination Dates"
        placeholder="Enter vaccination dates and details (e.g., June 28 - DHPP, July 12 - DHPP Booster)"
      />
      
      <div className="flex items-center gap-2 mb-1 mt-4">
        <Stethoscope className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Veterinary Checks</h3>
      </div>
      <TextareaInput
        form={form}
        name="vet_check_dates"
        label="Vet Check Dates"
        placeholder="Enter vet check dates and findings"
      />
      
      <div className="flex items-center gap-2 mb-1 mt-4">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Additional Notes</h3>
      </div>
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
