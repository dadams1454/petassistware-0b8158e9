
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle, AlertCircle, Scale } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type WeightUnit = 'lbs' | 'kg';

interface WeightInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  defaultUnit?: WeightUnit;
}

const WeightInput = ({ form, name, label, defaultUnit = 'lbs' }: WeightInputProps) => {
  const [inputError, setInputError] = useState<string | null>(null);
  const [unit, setUnit] = useState<WeightUnit>(defaultUnit);
  
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
      form.setValue(name, unit === 'lbs' ? '0.1' : '1');
      setInputError(null);
      return;
    }
    
    // Increment by 0.1 for lbs, 1 for kg
    const incrementAmount = unit === 'lbs' ? 0.1 : 1;
    const newWeight = currentWeightNum + incrementAmount;
    form.setValue(name, unit === 'lbs' ? newWeight.toFixed(1) : Math.round(newWeight));
    setInputError(null);
  };

  const decrementWeight = () => {
    const currentWeight = form.getValues(name);
    if (!currentWeight) return;
    
    const currentWeightNum = parseFloat(currentWeight);
    if (isNaN(currentWeightNum)) {
      form.setValue(name, '0');
      setInputError(null);
      return;
    }
    
    // Decrement by 0.1 for lbs, 1 for kg
    const decrementAmount = unit === 'lbs' ? 0.1 : 1;
    const newWeight = Math.max(0, currentWeightNum - decrementAmount);
    form.setValue(name, unit === 'lbs' ? newWeight.toFixed(1) : Math.round(newWeight));
    setInputError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    validateWeight(value);
  };

  const handleUnitChange = (newUnit: WeightUnit) => {
    const currentWeight = form.getValues(name);
    
    if (currentWeight && currentWeight !== '') {
      const numValue = parseFloat(currentWeight);
      if (!isNaN(numValue)) {
        // Convert between units
        if (newUnit === 'kg' && unit === 'lbs') {
          // Convert lbs to kg (1 lb ≈ 0.45 kg)
          const kg = (numValue * 0.45).toFixed(1);
          form.setValue(name, kg);
        } else if (newUnit === 'lbs' && unit === 'kg') {
          // Convert kg to lbs (1 kg ≈ 2.2 lbs)
          const lbs = (numValue * 2.2).toFixed(1);
          form.setValue(name, lbs);
        }
      }
    }
    
    setUnit(newUnit);
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
                className="rounded-l-none rounded-r-none" 
                onClick={incrementWeight}
              >
                <PlusCircle size={16} />
              </Button>
              
              <Select 
                value={unit} 
                onValueChange={(value) => handleUnitChange(value as WeightUnit)}
              >
                <SelectTrigger className="w-24 rounded-l-none">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>lbs</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="kg">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>kg</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
