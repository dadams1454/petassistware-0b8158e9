
/**
 * Weight unit type definitions and utilities
 */

// Weight unit enum
export enum WeightUnitEnum {
  OZ = 'oz',
  G = 'g',
  LB = 'lb',
  KG = 'kg'
}

// Weight unit type (union type for easier usage)
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit information with conversion factors
export interface WeightUnitInfo {
  id: string;  // For dropdown selection
  value: WeightUnit;  // The unit identifier
  name: string;  // Display name
  fullName: string;  // Full name (e.g., "Kilograms")
  toGramsFactor: number;  // Conversion factor to grams
  displayPrecision: number;  // Number of decimal places for display
  defaultMin: number;  // Default minimum value
  defaultMax: number;  // Default maximum value
  defaultIncrement: number;  // Default increment/step value
}

// Weight unit information for each supported unit
export const weightUnitInfos: WeightUnitInfo[] = [
  {
    id: 'oz',
    value: 'oz',
    name: 'oz',
    fullName: 'Ounces',
    toGramsFactor: 28.3495,
    displayPrecision: 1,
    defaultMin: 0,
    defaultMax: 64,
    defaultIncrement: 0.1
  },
  {
    id: 'g',
    value: 'g',
    name: 'g',
    fullName: 'Grams',
    toGramsFactor: 1,
    displayPrecision: 0,
    defaultMin: 0,
    defaultMax: 1000,
    defaultIncrement: 1
  },
  {
    id: 'lb',
    value: 'lb',
    name: 'lb',
    fullName: 'Pounds',
    toGramsFactor: 453.592,
    displayPrecision: 1,
    defaultMin: 0,
    defaultMax: 200,
    defaultIncrement: 0.1
  },
  {
    id: 'kg',
    value: 'kg',
    name: 'kg',
    fullName: 'Kilograms',
    toGramsFactor: 1000,
    displayPrecision: 1,
    defaultMin: 0,
    defaultMax: 100,
    defaultIncrement: 0.1
  }
];

/**
 * Standardize weight unit string to a valid WeightUnit
 */
export function standardizeWeightUnit(unit: string): WeightUnit {
  const normalizedUnit = unit?.toLowerCase()?.trim();
  
  switch (normalizedUnit) {
    case 'ounce':
    case 'ounces':
    case 'oz':
      return 'oz';
    
    case 'gram':
    case 'grams':
    case 'g':
      return 'g';
    
    case 'pound':
    case 'pounds':
    case 'lb':
    case 'lbs':
      return 'lb';
    
    case 'kilogram':
    case 'kilograms':
    case 'kg':
    case 'kgs':
      return 'kg';
    
    default:
      return 'g'; // Default to grams
  }
}

/**
 * Get weight unit info by unit value
 */
export function getWeightUnitInfo(unit: WeightUnit): WeightUnitInfo {
  const info = weightUnitInfos.find(u => u.value === standardizeWeightUnit(unit));
  return info || weightUnitInfos[0]; // Default to oz if not found
}
