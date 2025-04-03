
import { WeightUnit, WeightUnitWithLegacy, standardizeWeightUnit, formatWeightWithUnit, getWeightUnitName } from '@/types/common';

// Weight unit conversion utilities
export const weightUnits = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' }
];

/**
 * Convert a weight value from one unit to another
 * 
 * @param weight - The weight value to convert
 * @param fromUnit - The unit to convert from
 * @param toUnit - The unit to convert to
 * @returns The converted weight value
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnitWithLegacy,
  toUnit: WeightUnitWithLegacy
): number => {
  const standardFromUnit = standardizeWeightUnit(fromUnit);
  const standardToUnit = standardizeWeightUnit(toUnit);
  
  if (standardFromUnit === standardToUnit) return weight;

  // Convert everything to grams first
  let grams = 0;
  
  switch (standardFromUnit) {
    case 'g':
      grams = weight;
      break;
    case 'kg':
      grams = weight * 1000;
      break;
    case 'oz':
      grams = weight * 28.35;
      break;
    case 'lb':
      grams = weight * 453.59;
      break;
    default:
      grams = weight; // Default to assuming grams
  }

  // Then convert from grams to desired unit
  switch (standardToUnit) {
    case 'g':
      return Math.round(grams * 10) / 10;
    case 'kg':
      return Math.round((grams / 1000) * 100) / 100;
    case 'oz':
      return Math.round((grams / 28.35) * 100) / 100;
    case 'lb':
      return Math.round((grams / 453.59) * 100) / 100;
    default:
      return Math.round(grams * 10) / 10; // Default to grams
  }
};

// Re-export functions from common
export { standardizeWeightUnit, formatWeightWithUnit, getWeightUnitName };

/**
 * Calculate percent change between two weights
 * @param newWeight - The new weight
 * @param oldWeight - The old weight
 * @returns Percent change
 */
export const calculatePercentChange = (newWeight: number, oldWeight: number): number => {
  if (oldWeight === 0) return 0;
  return ((newWeight - oldWeight) / oldWeight) * 100;
};
