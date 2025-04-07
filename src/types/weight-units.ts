
/**
 * Weight unit types and utility functions
 */

// WeightUnit type as a string union type (for simpler type checking)
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// WeightUnitInfo interface for detailed weight unit information
export interface WeightUnitInfo {
  id: WeightUnit;
  name: string;
  abbreviation: string;
  system: 'imperial' | 'metric';
  conversionToG: number; // Conversion factor to grams
  precision: number; // Decimal places for display
}

// Weight units array with detailed information
export const weightUnits: WeightUnitInfo[] = [
  {
    id: 'oz',
    name: 'Ounces',
    abbreviation: 'oz',
    system: 'imperial',
    conversionToG: 28.3495,
    precision: 1
  },
  {
    id: 'g',
    name: 'Grams',
    abbreviation: 'g',
    system: 'metric',
    conversionToG: 1,
    precision: 0
  },
  {
    id: 'lb',
    name: 'Pounds',
    abbreviation: 'lb',
    system: 'imperial',
    conversionToG: 453.592,
    precision: 1
  },
  {
    id: 'kg',
    name: 'Kilograms',
    abbreviation: 'kg',
    system: 'metric',
    conversionToG: 1000,
    precision: 2
  }
];

// Export weightUnits with an alternative name for backward compatibility
export const weightUnitInfos = weightUnits;

/**
 * Standardize weight unit string to valid WeightUnit type
 */
export function standardizeWeightUnit(unit: string): WeightUnit {
  const unitLower = unit.toLowerCase();
  
  // Check for common variations
  if (unitLower === 'ounce' || unitLower === 'ounces' || unitLower === 'oz') {
    return 'oz';
  }
  
  if (unitLower === 'gram' || unitLower === 'grams' || unitLower === 'g') {
    return 'g';
  }
  
  if (unitLower === 'pound' || unitLower === 'pounds' || unitLower === 'lb' || unitLower === 'lbs') {
    return 'lb';
  }
  
  if (unitLower === 'kilogram' || unitLower === 'kilograms' || unitLower === 'kg' || unitLower === 'kgs') {
    return 'kg';
  }
  
  // Default to lb if unknown
  return 'lb';
}

// Helper to get the weight unit info by ID
export function getWeightUnitInfo(unitId: WeightUnit): WeightUnitInfo {
  const unit = weightUnits.find(u => u.id === unitId);
  return unit || weightUnits[2]; // Default to lb if not found
}

// Function to convert weight from one unit to another
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  const fromInfo = getWeightUnitInfo(fromUnit);
  const toInfo = getWeightUnitInfo(toUnit);
  
  // Convert to grams first
  const weightInGrams = weight * fromInfo.conversionToG;
  
  // Then convert from grams to target unit
  return weightInGrams / toInfo.conversionToG;
}

// Format weight with appropriate precision
export function formatWeight(weight: number, unit: WeightUnit): string {
  const unitInfo = getWeightUnitInfo(unit);
  return `${weight.toFixed(unitInfo.precision)} ${unitInfo.abbreviation}`;
}
