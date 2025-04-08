
/**
 * Weight unit definitions and utilities
 */

/**
 * Weight unit type as a string union
 */
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

/**
 * Enum for weight units (for backward compatibility)
 */
export enum WeightUnitEnum {
  OUNCES = 'oz',
  GRAMS = 'g',
  POUNDS = 'lb',
  KILOGRAMS = 'kg'
}

/**
 * Weight unit information interface
 */
export interface WeightUnitInfo {
  id: string;
  name: string;
  abbreviation: string;
  type: 'imperial' | 'metric';
  conversionToGrams: number;
  precision: number;
  toGrams?: number; // For compatibility with existing code
  value?: string;   // For compatibility with select components
  label?: string;   // For compatibility with select components
}

/**
 * Weight unit information for each unit
 */
export const weightUnitInfos: WeightUnitInfo[] = [
  {
    id: 'oz',
    name: 'Ounces',
    abbreviation: 'oz',
    type: 'imperial',
    conversionToGrams: 28.3495,
    precision: 1,
    value: 'oz',
    label: 'Ounces (oz)'
  },
  {
    id: 'g',
    name: 'Grams',
    abbreviation: 'g',
    type: 'metric',
    conversionToGrams: 1,
    precision: 0,
    value: 'g',
    label: 'Grams (g)'
  },
  {
    id: 'lb',
    name: 'Pounds',
    abbreviation: 'lb',
    type: 'imperial',
    conversionToGrams: 453.592,
    precision: 1,
    value: 'lb',
    label: 'Pounds (lb)'
  },
  {
    id: 'kg',
    name: 'Kilograms',
    abbreviation: 'kg',
    type: 'metric',
    conversionToGrams: 1000,
    precision: 2,
    value: 'kg',
    label: 'Kilograms (kg)'
  }
];

// Add toGrams property for backward compatibility
weightUnitInfos.forEach(unit => {
  unit.toGrams = unit.conversionToGrams;
});

/**
 * Get weight unit info by unit ID
 */
export function getWeightUnitInfo(unit: WeightUnit): WeightUnitInfo {
  return weightUnitInfos.find(info => info.id === unit) || weightUnitInfos[0];
}

/**
 * Convert weight from one unit to another
 */
export function convertWeight(
  weight: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  const fromInfo = getWeightUnitInfo(fromUnit);
  const toInfo = getWeightUnitInfo(toUnit);
  
  // Convert to grams first, then to the target unit
  const weightInGrams = weight * fromInfo.conversionToGrams;
  const convertedWeight = weightInGrams / toInfo.conversionToGrams;
  
  // Apply appropriate precision
  return Number(convertedWeight.toFixed(toInfo.precision));
}

/**
 * Format weight for display with unit
 */
export function formatWeight(
  weight: number,
  unit: WeightUnit,
  options: { includeName?: boolean } = {}
): string {
  const unitInfo = getWeightUnitInfo(unit);
  const formatted = weight.toFixed(unitInfo.precision);
  
  return options.includeName
    ? `${formatted} ${unitInfo.name}`
    : `${formatted} ${unitInfo.abbreviation}`;
}

/**
 * Standardize weight unit string to WeightUnit type
 */
export function standardizeWeightUnit(unit: string): WeightUnit {
  const normalized = unit.toLowerCase().trim();
  
  switch (normalized) {
    case 'ounces':
    case 'ounce':
    case 'oz':
      return 'oz';
    case 'grams':
    case 'gram':
    case 'g':
      return 'g';
    case 'pounds':
    case 'pound':
    case 'lb':
    case 'lbs':
      return 'lb';
    case 'kilograms':
    case 'kilogram':
    case 'kg':
    case 'kgs':
      return 'kg';
    default:
      return 'lb'; // Default to pounds
  }
}
