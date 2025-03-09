
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface WeightInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

const WeightInput = ({ form, name, label }: WeightInputProps) => {
  const [inputError, setInputError] = useState<string | null>(null);
  
  const validateWeight = (value: string): boolean => {
    if (value === '') return true;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setInputError('Please enter a valid number');
      return false;
    }
    
    if (numValue < 0) {
      setInputError('Weight cannot be negative');
      return false;
    }
    
    setInputError(null);
    return true;
  };

  const incrementWeight = () => {
    const currentWeight = form.getValues(name);
    const currentWeightNum = currentWeight ? parseFloat(currentWeight) : 0;
    if (isNaN(currentWeightNum)) {
      form.setValue(name, '0.1');
      setInputError(null);
      return;
    }
    const newWeight = currentWeightNum + 0.1;
    form.setValue(name, newWeight.toFixed(1));
    setInputError(null);
  };

  const decrementWeight = () => {
    const currentWeight = form.getValues(name);
    if (!currentWeight) return;
    
    const currentWeightNum = parseFloat(currentWeight);
    if (isNaN(currentWeightNum)) {
      form.setValue(name, '0.0');
      setInputError(null);
      return;
    }
    
    const newWeight = Math.max(0, currentWeightNum - 0.1);
    form.setValue(name, newWeight.toFixed(1));
    setInputError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    validateWeight(value);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-col space-y-2">
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
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Weight"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                    className={`rounded-none text-center ${inputError ? 'border-red-500 pr-10' : ''}`}
                    aria-invalid={!!inputError}
                  />
                  {inputError && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
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
            {inputError && (
              <p className="text-sm font-medium text-red-500 mt-1">{inputError}</p>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default WeightInput;
