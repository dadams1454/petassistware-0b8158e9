
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

// Export weightUnits with the name weightUnitInfos for backward compatibility
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

// Convert weight to grams (utility function)
export function convertWeightToGrams(weight: number, unit: WeightUnit): number {
  const unitInfo = getWeightUnitInfo(unit);
  return weight * unitInfo.conversionToG;
}

// Determine appropriate weight unit based on weight value and current unit
export function getAppropriateWeightUnit(
  weight: number, 
  currentUnit: WeightUnit, 
  ageInDays?: number
): WeightUnit {
  const weightInGrams = convertWeight(weight, currentUnit, 'g');
  
  // For very young puppies (less than 14 days), use ounces if they're small
  if (ageInDays && ageInDays < 14 && weightInGrams < 1000) {
    return 'oz';
  }
  
  // For puppies between 2-8 weeks, use pounds if they're over 500g
  if (ageInDays && ageInDays < 56 && weightInGrams >= 500) {
    return 'lb';
  }
  
  // For older puppies and small breeds, use pounds
  if (weightInGrams >= 1000) {
    return 'lb';
  }
  
  // For larger dogs, use kilograms if over 20kg
  if (weightInGrams >= 20000) {
    return 'kg';
  }
  
  // Default to ounces for very small puppies
  return 'oz';
}
