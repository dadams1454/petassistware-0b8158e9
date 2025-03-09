
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface WeightInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

const WeightInput = ({ form, name, label }: WeightInputProps) => {
  const incrementWeight = () => {
    const currentWeight = form.getValues(name);
    const currentWeightNum = currentWeight ? parseFloat(currentWeight) : 0;
    const newWeight = currentWeightNum + 0.1;
    form.setValue(name, newWeight.toFixed(1));
  };

  const decrementWeight = () => {
    const currentWeight = form.getValues(name);
    if (!currentWeight) return;
    
    const currentWeightNum = parseFloat(currentWeight);
    const newWeight = Math.max(0, currentWeightNum - 0.1);
    form.setValue(name, newWeight.toFixed(1));
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center">
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              className="rounded-r-none" 
              onClick={decrementWeight}
            >
              <MinusCircle size={16} />
            </Button>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="Weight"
                {...field}
                className="rounded-none text-center"
              />
            </FormControl>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              className="rounded-l-none" 
              onClick={incrementWeight}
            >
              <PlusCircle size={16} />
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WeightInput;
