
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusCircle, PlusCircle, AlertCircle, Scale } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeightUnit, WeightUnitWithLegacy, standardizeWeightUnit } from '@/types/common';

interface WeightInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  defaultUnit?: WeightUnit;
}

const WeightInput = ({ form, name, label, defaultUnit = 'lb' }: WeightInputProps) => {
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
      form.setValue(name, getDefaultIncrement());
      setInputError(null);
      return;
    }
    
    // Increment based on the unit
    const incrementAmount = getIncrementAmount();
    const newWeight = currentWeightNum + incrementAmount;
    form.setValue(name, formatWeight(newWeight));
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
    
    // Decrement based on the unit
    const decrementAmount = getIncrementAmount();
    const newWeight = Math.max(0, currentWeightNum - decrementAmount);
    form.setValue(name, formatWeight(newWeight));
    setInputError(null);
  };

  const getIncrementAmount = (): number => {
    const standardUnit = standardizeWeightUnit(unit);
    switch (standardUnit) {
      case 'lb': return 0.1;
      case 'kg': return 0.1;
      case 'oz': return 0.5;
      case 'g': return 5;
      default: return 0.1;
    }
  };

  const getDefaultIncrement = (): string => {
    const standardUnit = standardizeWeightUnit(unit);
    switch (standardUnit) {
      case 'lb': return '0.1';
      case 'kg': return '0.1';
      case 'oz': return '0.5';
      case 'g': return '5';
      default: return '0.1';
    }
  };

  const formatWeight = (value: number): string => {
    const standardUnit = standardizeWeightUnit(unit);
    switch (standardUnit) {
      case 'lb':
      case 'kg':
        return value.toFixed(1);
      case 'oz':
        return value.toFixed(1);
      case 'g':
        return Math.round(value).toString();
      default:
        return value.toFixed(1);
    }
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
        let convertedWeight: number;
        
        // First convert current unit to grams (base unit)
        let weightInGrams: number;
        const standardUnit = standardizeWeightUnit(unit);
        switch (standardUnit) {
          case 'lb': weightInGrams = numValue * 453.59; break;
          case 'kg': weightInGrams = numValue * 1000; break;
          case 'oz': weightInGrams = numValue * 28.35; break;
          case 'g': weightInGrams = numValue; break;
          default: weightInGrams = numValue;
        }
        
        // Then convert from grams to new unit
        const standardNewUnit = standardizeWeightUnit(newUnit);
        switch (standardNewUnit) {
          case 'lb': convertedWeight = weightInGrams / 453.59; break;
          case 'kg': convertedWeight = weightInGrams / 1000; break;
          case 'oz': convertedWeight = weightInGrams / 28.35; break;
          case 'g': convertedWeight = weightInGrams; break;
          default: convertedWeight = weightInGrams;
        }
        
        form.setValue(name, formatWeight(convertedWeight));
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
                  <SelectItem value="lb">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>lb</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="kg">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>kg</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="oz">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>oz</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="g">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>g</span>
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
