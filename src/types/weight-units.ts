
/**
 * Weight Units type definitions
 */

// WeightUnit as a string union type for flexibility
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// WeightUnit as an enum for type safety
export enum WeightUnitEnum {
  OUNCES = 'oz',
  GRAMS = 'g',
  POUNDS = 'lb',
  KILOGRAMS = 'kg'
}

// Interface for additional weight unit metadata
export interface WeightUnitInfo {
  unit: WeightUnit;
  fullName: string;
  displayName: string;
  conversionToGrams: number;
  isMassUnit: boolean;
  isMetric: boolean;
  decimalPlaces: number;
  label?: string;
}

// Weight unit information lookup
export const weightUnitInfos: Record<WeightUnit, WeightUnitInfo> = {
  'oz': {
    unit: 'oz',
    fullName: 'ounces',
    displayName: 'oz',
    conversionToGrams: 28.3495,
    isMassUnit: true,
    isMetric: false,
    decimalPlaces: 1,
    label: 'Ounces (oz)'
  },
  'g': {
    unit: 'g',
    fullName: 'grams',
    displayName: 'g',
    conversionToGrams: 1,
    isMassUnit: true,
    isMetric: true,
    decimalPlaces: 0,
    label: 'Grams (g)'
  },
  'lb': {
    unit: 'lb',
    fullName: 'pounds',
    displayName: 'lb',
    conversionToGrams: 453.592,
    isMassUnit: true,
    isMetric: false,
    decimalPlaces: 1,
    label: 'Pounds (lb)'
  },
  'kg': {
    unit: 'kg',
    fullName: 'kilograms',
    displayName: 'kg',
    conversionToGrams: 1000,
    isMassUnit: true,
    isMetric: true,
    decimalPlaces: 1,
    label: 'Kilograms (kg)'
  }
};

// Helper function to get weight unit info
export function getWeightUnitInfo(unit: string | WeightUnit): WeightUnitInfo {
  const standardUnit = standardizeWeightUnit(unit);
  return weightUnitInfos[standardUnit];
}

// Helper function to standardize weight unit strings
export function standardizeWeightUnit(unit: string | WeightUnit): WeightUnit {
  const normalizedUnit = String(unit).toLowerCase().trim();
  
  // Direct matches
  if (normalizedUnit === 'oz' || normalizedUnit === 'ounce' || normalizedUnit === 'ounces') {
    return 'oz';
  }
  
  if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams') {
    return 'g';
  }
  
  if (normalizedUnit === 'lb' || normalizedUnit === 'pound' || normalizedUnit === 'pounds') {
    return 'lb';
  }
  
  if (normalizedUnit === 'kg' || normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms') {
    return 'kg';
  }
  
  // Default to pounds if unknown
  return 'lb';
}
