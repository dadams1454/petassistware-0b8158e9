
import { WeightUnit, convertWeight, standardizeWeightUnit } from '@/types/common';

/**
 * Calculate percent change between two weight values
 */
export const calculatePercentChange = (
  oldWeight: number, 
  newWeight: number, 
  oldUnit: WeightUnit,
  newUnit: WeightUnit
): number => {
  // Convert both weights to the same unit for comparison
  const standardizedOldWeight = oldUnit !== newUnit 
    ? convertWeight(oldWeight, oldUnit, newUnit) 
    : oldWeight;
  
  // Calculate percentage change
  return ((newWeight - standardizedOldWeight) / standardizedOldWeight) * 100;
};

// Export the weight units array for UI components
export const weightUnits = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'g', name: 'Grams' }
];
