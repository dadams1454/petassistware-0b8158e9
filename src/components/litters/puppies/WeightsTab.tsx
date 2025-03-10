
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import WeightInput from '@/components/dogs/form/WeightInput';
import { PuppyFormData } from './types';

interface WeightsTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const WeightsTab: React.FC<WeightsTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeightInput 
          form={form} 
          name="birth_weight" 
          label="Birth Weight (oz)" 
        />
        
        <WeightInput 
          form={form} 
          name="current_weight" 
          label="Current Weight (oz)" 
        />
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <p className="text-sm text-muted-foreground mb-2">
          Note: This simplified form shows birth weight and current weight. For more detailed 
          weight tracking over time, we'll be adding a dedicated weight history feature in a future update.
        </p>
      </div>
    </div>
  );
};

export default WeightsTab;
