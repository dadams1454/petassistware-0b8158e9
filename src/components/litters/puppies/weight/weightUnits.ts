
import { WeightUnit, standardizeWeightUnit, formatWeightWithUnit, getWeightUnitName } from '@/types/common';

/**
 * Convert a weight value from one unit to another
 */
export const convertWeight = (
  weight: number, 
  fromUnit: string, 
  toUnit: WeightUnit
): number => {
  const standardFromUnit = standardizeWeightUnit(fromUnit);
  const standardToUnit = standardizeWeightUnit(toUnit);
  
  if (standardFromUnit === standardToUnit) {
    return weight;
  }
  
  // Convert to grams first (as base unit)
  let grams = 0;
  
  switch (standardFromUnit) {
    case 'g':
      grams = weight;
      break;
    case 'kg':
      grams = weight * 1000;
      break;
    case 'oz':
      grams = weight * 28.3495;
      break;
    case 'lb':
      grams = weight * 453.592;
      break;
    default:
      grams = weight;
  }
  
  // Convert from grams to target unit
  switch (standardToUnit) {
    case 'g':
      return Math.round(grams);
    case 'kg':
      return parseFloat((grams / 1000).toFixed(2));
    case 'oz':
      return parseFloat((grams / 28.3495).toFixed(2));
    case 'lb':
      return parseFloat((grams / 453.592).toFixed(2));
    default:
      return weight;
  }
};

/**
 * Format a weight with its appropriate unit for display
 */
export const formatWeightWithDisplay = (
  weight: number,
  unit: WeightUnit
): string => {
  return formatWeightWithUnit(weight, unit);
};

/**
 * Calculate percent change between two weights
 */
export const calculatePercentChange = (newWeight: number, oldWeight: number): number => {
  if (oldWeight === 0) return 0;
  return Math.round(((newWeight - oldWeight) / oldWeight) * 100 * 10) / 10;
};

// Re-export common weight functions
export { standardizeWeightUnit, formatWeightWithUnit, getWeightUnitName };

// Weight unit options for dropdowns/selects
export const weightUnits = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' }
];
