
import { WeightUnit } from '@/types/puppyTracking';

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
  fromUnit: string,
  toUnit: string
): number => {
  if (fromUnit === toUnit) return weight;

  // Convert everything to grams first
  let grams = 0;
  
  switch (fromUnit) {
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
    case 'lbs':
      grams = weight * 453.59;
      break;
    default:
      grams = weight; // Default to assuming grams
  }

  // Then convert from grams to desired unit
  switch (toUnit) {
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

/**
 * Format weight with unit
 * @param weight - The weight value
 * @param unit - The weight unit
 * @returns Formatted weight string
 */
export const formatWeightWithUnit = (weight: number, unit: WeightUnit): string => {
  return `${weight} ${unit}`;
};

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

/**
 * Get the standard weight unit abbreviation
 * 
 * @param unit - The unit name to standardize
 * @returns The standardized unit abbreviation
 */
export const standardizeWeightUnit = (unit: string): string => {
  const unitMap: Record<string, string> = {
    'g': 'g',
    'gram': 'g',
    'grams': 'g',
    'kg': 'kg',
    'kilo': 'kg',
    'kilos': 'kg',
    'kilogram': 'kg',
    'kilograms': 'kg',
    'oz': 'oz',
    'ounce': 'oz',
    'ounces': 'oz',
    'lb': 'lb',
    'lbs': 'lb',
    'pound': 'lb',
    'pounds': 'lb'
  };

  return unitMap[unit.toLowerCase()] || 'g';
};

/**
 * Get human-readable weight unit name
 * 
 * @param unit - The unit abbreviation
 * @returns The full name of the weight unit
 */
export const getWeightUnitName = (unit: string): string => {
  const unitMap: Record<string, string> = {
    'g': 'Grams',
    'kg': 'Kilograms',
    'oz': 'Ounces',
    'lb': 'Pounds',
    'lbs': 'Pounds'
  };

  return unitMap[unit] || 'Grams';
};
