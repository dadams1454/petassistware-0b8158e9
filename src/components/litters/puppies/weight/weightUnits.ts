
import { WeightUnit, WeightUnitInfo, getWeightUnitInfo, getWeightUnitName } from '@/types/common';

/**
 * Calculate percent change between two weight values
 */
export const calculatePercentChange = (
  oldWeight: number, 
  newWeight: number
): number => {
  // Calculate percentage change
  return ((newWeight - oldWeight) / oldWeight) * 100;
};

/**
 * Convert weight between different units
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number => {
  if (fromUnit === toUnit) {
    return weight;
  }

  // Convert to grams first (base unit)
  let weightInGrams = 0;
  
  switch (fromUnit) {
    case 'g':
      weightInGrams = weight;
      break;
    case 'kg':
      weightInGrams = weight * 1000;
      break;
    case 'oz':
      weightInGrams = weight * 28.3495;
      break;
    case 'lb':
      weightInGrams = weight * 453.59237;
      break;
    default:
      weightInGrams = weight;
      break;
  }
  
  // Convert from grams to target unit
  switch (toUnit) {
    case 'g':
      return weightInGrams;
    case 'kg':
      return weightInGrams / 1000;
    case 'oz':
      return weightInGrams / 28.3495;
    case 'lb':
      return weightInGrams / 453.59237;
    default:
      return weight;
  }
};

// Export the weight units array for UI components
export const weightUnits: WeightUnitInfo[] = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'g', name: 'Grams' }
];

// Re-export WeightUnit type for external use
export type { WeightUnit, WeightUnitInfo };
