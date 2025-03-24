
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import WeightInput from '@/components/dogs/form/WeightInput';
import { Weight, Scale, Info } from 'lucide-react';
import { PuppyFormData } from './types';
import { WeightUnit } from '@/types/dog';

interface WeightsTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const WeightsTab: React.FC<WeightsTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Weight className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium">Weight Tracking</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Birth Weight</span>
          </div>
          <WeightInput 
            form={form} 
            name="birth_weight" 
            label="Birth Weight" 
            defaultUnit="oz" as WeightUnit
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Current Weight</span>
          </div>
          <WeightInput 
            form={form} 
            name="current_weight" 
            label="Current Weight" 
            defaultUnit="oz" as WeightUnit
          />
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-md mt-4">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-sm text-muted-foreground">
            You can switch between ounces (oz) and grams (g) for weight measurements. The system will automatically 
            convert values when you change units. For more detailed weight tracking over time, we'll be adding 
            a dedicated weight history feature in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeightsTab;
