
import { WeightUnit } from '@/types/common';

/**
 * Convert a weight value from one unit to another
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnit | string,
  toUnit: WeightUnit | string
): number => {
  if (fromUnit === toUnit) {
    return weight;
  }

  // Standardize the units
  const standardFromUnit = standardizeUnit(fromUnit);
  const standardToUnit = standardizeUnit(toUnit);
  
  // Convert to grams first (base unit)
  let weightInGrams = 0;
  
  switch (standardFromUnit) {
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
  }
  
  // Convert from grams to target unit
  switch (standardToUnit) {
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

/**
 * Standardize unit code (handle 'lbs' -> 'lb', etc.)
 */
const standardizeUnit = (unit: WeightUnit | string): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  
  // Cast to WeightUnit if it's a valid unit
  if (['oz', 'g', 'lb', 'kg'].includes(unit as string)) {
    return unit as WeightUnit;
  }
  
  // Default to lb
  return 'lb';
};

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
