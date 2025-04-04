
// Import necessary types
import { Json } from '../integrations/supabase/types';

// Gender type
export type Gender = 'Male' | 'Female' | 'Unknown';

// Weight unit type
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// Weight unit with legacy support
export type WeightUnitWithLegacy = WeightUnit | 'grams' | 'kilograms' | 'ounces' | 'pounds';

// Array of valid weight units
export const weightUnits: WeightUnit[] = ['g', 'kg', 'oz', 'lb'];

// Standardize weight unit to handle legacy formats
export const standardizeWeightUnit = (unit: WeightUnitWithLegacy): WeightUnit => {
  switch (unit) {
    case 'grams':
      return 'g';
    case 'kilograms':
      return 'kg';
    case 'ounces':
      return 'oz';
    case 'pounds':
      return 'lb';
    default:
      return weightUnits.includes(unit as WeightUnit) 
        ? (unit as WeightUnit)
        : 'g'; // Default to grams if invalid
  }
};

// Helper functions to convert between weight units
export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first as base unit
  let weightInGrams = weight;
  if (fromUnit === 'kg') weightInGrams = weight * 1000;
  if (fromUnit === 'oz') weightInGrams = weight * 28.35;
  if (fromUnit === 'lb') weightInGrams = weight * 453.59;
  
  // Convert from grams to target unit
  if (toUnit === 'g') return weightInGrams;
  if (toUnit === 'kg') return weightInGrams / 1000;
  if (toUnit === 'oz') return weightInGrams / 28.35;
  if (toUnit === 'lb') return weightInGrams / 453.59;
  
  return weight; // Fallback
};

export const formatWeightWithUnit = (weight: number, unit: WeightUnit): string => {
  return `${weight.toFixed(unit === 'g' || unit === 'oz' ? 0 : 2)} ${unit}`;
};

// Weight unit with display properties for UI
export interface WeightUnitOption {
  code: WeightUnit;
  name: string;
}

export const weightUnitOptions: WeightUnitOption[] = [
  { code: 'g', name: 'Grams' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'lb', name: 'Pounds' }
];
