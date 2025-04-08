
/**
 * Standardized weight unit definitions
 */

/**
 * Weight unit type as a string union
 */
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

/**
 * Enum for weight units (for compatibility with existing code)
 */
export enum WeightUnitEnum {
  OZ = 'oz',
  G = 'g',
  LB = 'lb',
  KG = 'kg'
}

/**
 * Interface for weight unit information
 */
export interface WeightUnitInfo {
  unit: WeightUnit;
  label: string;
  abbreviation: string;
  toGrams: number; // Conversion factor to grams
  precision: number; // Default decimal precision
}

/**
 * Weight unit information array
 */
export const weightUnitInfos: WeightUnitInfo[] = [
  { unit: 'oz', label: 'Ounces', abbreviation: 'oz', toGrams: 28.3495, precision: 1 },
  { unit: 'g', label: 'Grams', abbreviation: 'g', toGrams: 1, precision: 0 },
  { unit: 'lb', label: 'Pounds', abbreviation: 'lb', toGrams: 453.592, precision: 2 },
  { unit: 'kg', label: 'Kilograms', abbreviation: 'kg', toGrams: 1000, precision: 2 }
];

/**
 * Get weight unit information for a specific unit
 */
export function getWeightUnitInfo(unit: WeightUnit): WeightUnitInfo {
  const info = weightUnitInfos.find(info => info.unit === unit);
  return info || weightUnitInfos[0]; // Default to oz if not found
}

/**
 * Standardize a weight unit value to ensure it's a valid WeightUnit
 */
export function standardizeWeightUnit(unit: string): WeightUnit {
  const normalizedUnit = String(unit).toLowerCase();
  
  if (normalizedUnit === 'oz' || normalizedUnit === 'ounce' || normalizedUnit === 'ounces') {
    return 'oz';
  } else if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams') {
    return 'g';
  } else if (normalizedUnit === 'lb' || normalizedUnit === 'pound' || normalizedUnit === 'pounds') {
    return 'lb';
  } else if (normalizedUnit === 'kg' || normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms') {
    return 'kg';
  }
  
  // Default to pounds if unrecognized
  return 'lb';
}
