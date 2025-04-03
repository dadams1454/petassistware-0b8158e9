
// Common type definitions used across the application

// Standardized weight unit type used throughout the application
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';

// Extended weight unit type for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'lbs' | 'kgs' | 'pounds' | 'kilograms' | 'ounces' | 'grams';

// Weight unit option for dropdowns
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Available weight units for dropdowns
export const weightUnits: WeightUnitOption[] = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' }
];

/**
 * Standardizes weight unit values from various sources
 * This helps when data might come with different casing or formats (lbs vs lb)
 */
export function standardizeWeightUnit(unit: string): WeightUnit {
  const normalizedUnit = unit.toLowerCase();
  
  if (normalizedUnit === 'lbs' || normalizedUnit === 'lb' || normalizedUnit === 'pound' || normalizedUnit === 'pounds') {
    return 'lb';
  } else if (normalizedUnit === 'kg' || normalizedUnit === 'kgs' || normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms') {
    return 'kg';
  } else if (normalizedUnit === 'oz' || normalizedUnit === 'ounce' || normalizedUnit === 'ounces') {
    return 'oz';
  } else if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams') {
    return 'g';
  }
  
  // Default to lb if unknown unit is provided
  console.warn(`Unknown weight unit: ${unit}, defaulting to lb`);
  return 'lb';
}

/**
 * Format weight with appropriate unit
 */
export function formatWeightWithUnit(weight: number, unit: WeightUnit): string {
  return `${weight} ${getWeightUnitName(unit)}`;
}

/**
 * Get display name for weight unit
 */
export function getWeightUnitName(unit: WeightUnit): string {
  switch (unit) {
    case 'lb': return 'lb';
    case 'kg': return 'kg';
    case 'oz': return 'oz';
    case 'g': return 'g';
    default: return unit;
  }
}

/**
 * Convert weight between different units
 */
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  // If units are the same, return the original weight
  if (fromUnit === toUnit) return weight;

  // Convert to grams as an intermediate unit
  let gramsWeight: number;
  
  // Convert from original unit to grams
  switch (fromUnit) {
    case 'lb': gramsWeight = weight * 453.592; break;
    case 'kg': gramsWeight = weight * 1000; break;
    case 'oz': gramsWeight = weight * 28.3495; break;
    case 'g': gramsWeight = weight; break;
    default: gramsWeight = weight; break;
  }
  
  // Convert from grams to target unit
  switch (toUnit) {
    case 'lb': return gramsWeight / 453.592;
    case 'kg': return gramsWeight / 1000;
    case 'oz': return gramsWeight / 28.3495;
    case 'g': return gramsWeight;
    default: return gramsWeight;
  }
}
