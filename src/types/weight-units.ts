
/**
 * Weight unit definitions and utilities
 */

// Define weight unit type as a string literal union type
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// Also provide an enum for backward compatibility
export enum WeightUnitEnum {
  GRAMS = 'g',
  KILOGRAMS = 'kg',
  OUNCES = 'oz',
  POUNDS = 'lb'
}

// Weight unit information for conversion and display
export interface WeightUnitInfo {
  value: WeightUnit;
  label: string;
  gramsPerUnit: number;
  precision: number;
  minValue: number;
  maxValue: number;
}

// Weight unit conversion information
export const weightUnitInfos: WeightUnitInfo[] = [
  {
    value: 'g',
    label: 'Grams',
    gramsPerUnit: 1,
    precision: 0,
    minValue: 1,
    maxValue: 1000
  },
  {
    value: 'kg',
    label: 'Kilograms',
    gramsPerUnit: 1000,
    precision: 2,
    minValue: 0.01,
    maxValue: 100
  },
  {
    value: 'oz',
    label: 'Ounces',
    gramsPerUnit: 28.3495,
    precision: 1,
    minValue: 0.1,
    maxValue: 100
  },
  {
    value: 'lb',
    label: 'Pounds',
    gramsPerUnit: 453.592,
    precision: 2,
    minValue: 0.01,
    maxValue: 200
  }
];

/**
 * Standardizes a weight unit input to ensure it's a valid WeightUnit
 */
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const normalizedUnit = unit.toLowerCase();
  
  // Check if it's one of our standard units
  if (['g', 'kg', 'oz', 'lb'].includes(normalizedUnit)) {
    return normalizedUnit as WeightUnit;
  }
  
  // Handle common variations
  if (['gram', 'grams'].includes(normalizedUnit)) return 'g';
  if (['kilogram', 'kilograms', 'kilo', 'kilos'].includes(normalizedUnit)) return 'kg';
  if (['ounce', 'ounces'].includes(normalizedUnit)) return 'oz';
  if (['pound', 'pounds'].includes(normalizedUnit)) return 'lb';
  
  // Default to grams if we can't determine the unit
  return 'g';
};
