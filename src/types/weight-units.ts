
/**
 * Weight unit type definitions
 */

/**
 * String literal type for weight units
 */
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

/**
 * Weight unit enum for backward compatibility
 */
export enum WeightUnitEnum {
  OZ = 'oz',
  G = 'g',
  LB = 'lb',
  KG = 'kg'
}

/**
 * Weight unit information interface
 */
export interface WeightUnitInfo {
  id: WeightUnit;
  label: string;
  displayName: string;
  toGrams: number;
  precision: number;
  isImperial: boolean;
}

/**
 * Weight unit information objects
 */
export const weightUnitInfos: WeightUnitInfo[] = [
  {
    id: 'g',
    label: 'Grams',
    displayName: 'g',
    toGrams: 1,
    precision: 0,
    isImperial: false
  },
  {
    id: 'kg',
    label: 'Kilograms',
    displayName: 'kg',
    toGrams: 1000,
    precision: 2,
    isImperial: false
  },
  {
    id: 'oz',
    label: 'Ounces',
    displayName: 'oz',
    toGrams: 28.3495,
    precision: 1,
    isImperial: true
  },
  {
    id: 'lb',
    label: 'Pounds',
    displayName: 'lb',
    toGrams: 453.592,
    precision: 1,
    isImperial: true
  }
];

/**
 * Get weight unit info by unit
 */
export function getWeightUnitInfo(unit: WeightUnit): WeightUnitInfo {
  const info = weightUnitInfos.find(u => u.id === unit);
  if (!info) {
    throw new Error(`Unknown weight unit: ${unit}`);
  }
  return info;
}

/**
 * Standardize weight unit input
 */
export function standardizeWeightUnit(unit: string): WeightUnit {
  const normalized = unit.toLowerCase().trim();
  
  // Handle common variations
  if (normalized === 'grams' || normalized === 'gram' || normalized === 'g') return 'g';
  if (normalized === 'kilograms' || normalized === 'kilogram' || normalized === 'kg') return 'kg';
  if (normalized === 'ounces' || normalized === 'ounce' || normalized === 'oz') return 'oz';
  if (normalized === 'pounds' || normalized === 'pound' || normalized === 'lb' || normalized === 'lbs') return 'lb';
  
  // Default to grams if unknown
  console.warn(`Unknown weight unit: ${unit}, defaulting to grams`);
  return 'g';
}
