
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InputWithLabel } from '@/components/ui/input-with-label';
import { SelectWithLabel } from '@/components/ui/select-with-label';
import { DatePickerWithLabel } from '@/components/ui/date-picker-with-label';
import { TextareaWithLabel } from '@/components/ui/textarea-with-label';
import { Button } from '@/components/ui/button';
import { formatWeight } from '@/utils/weightUtils';
import { useForm, UseFormReturn } from 'react-hook-form';
import { WeightUnitValue } from '@/types/index';

// Weight units with appropriate display names
const weightUnits = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'oz', label: 'Ounces (oz)' }
];

export interface WeightFormValues {
  weight?: number;
  unit?: WeightUnitValue;
  date?: Date;
  notes?: string;
}

interface WeightEntryFormProps {
  initialData?: WeightFormValues;
  onSubmit: (data: WeightFormValues) => void;
  onCancel?: () => void;
  form: UseFormReturn<WeightFormValues>;
  isSubmitting?: boolean;
  currentWeight?: number;
  currentUnit?: WeightUnitValue;
}

const WeightEntryForm: React.FC<WeightEntryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  form,
  isSubmitting = false,
  currentWeight,
  currentUnit = 'lb'
}) => {
  const { handleSubmit, watch, setValue, register, formState } = form;
  const { errors } = formState;
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <InputWithLabel
                label="Weight"
                type="number"
                placeholder={currentWeight ? formatWeight(currentWeight, currentUnit).toString() : "Enter weight"}
                error={errors.weight?.message}
                {...register("weight", { 
                  required: "Weight is required",
                  valueAsNumber: true
                })}
              />
            </div>
            
            <div className="w-full sm:w-40">
              <SelectWithLabel
                label="Unit"
                options={weightUnits}
                defaultValue={initialData?.unit || currentUnit || 'lb'}
                error={errors.unit?.message}
                {...register("unit")}
              />
            </div>
          </div>
          
          <DatePickerWithLabel
            label="Date"
            date={watch("date")}
            onSelect={(date) => setValue("date", date)}
            placeholder="Select date"
            error={errors.date?.message}
          />
          
          <TextareaWithLabel
            label="Notes"
            placeholder="Any observations or context about this weight"
            error={errors.notes?.message}
            {...register("notes")}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Weight'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeightEntryForm;
