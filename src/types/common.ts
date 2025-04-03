
/**
 * Common type definitions used across the application
 */

// Weight related types
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit option for dropdowns and UI
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
  code: string;
  name: string;
}

// Weight units array for use in dropdowns
export const weightUnits: WeightUnitOption[] = [
  { value: 'lb', code: 'lb', label: 'Pound (lb)', name: 'Pounds' },
  { value: 'kg', code: 'kg', label: 'Kilogram (kg)', name: 'Kilograms' },
  { value: 'oz', code: 'oz', label: 'Ounce (oz)', name: 'Ounces' },
  { value: 'g', code: 'g', label: 'Gram (g)', name: 'Grams' }
];

/**
 * Standardize a weight unit to ensure it's a valid one
 */
export const standardizeWeightUnit = (unit?: string): WeightUnit => {
  if (!unit) return 'lb';
  
  const normalizedUnit = unit.toLowerCase();
  
  if (normalizedUnit === 'lbs') return 'lb';
  if (normalizedUnit === 'oz' || normalizedUnit === 'ounce' || normalizedUnit === 'ounces') return 'oz';
  if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams') return 'g';
  if (normalizedUnit === 'kg' || normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms') return 'kg';
  
  return 'lb'; // Default fallback
};

/**
 * Get the full name of a weight unit
 */
export const getWeightUnitName = (unit: WeightUnit): string => {
  const unitOption = weightUnits.find(u => u.value === unit);
  return unitOption?.name || 'Pounds';
};

/**
 * Format weight with appropriate unit
 */
export const formatWeightWithUnit = (weight: number, unit: WeightUnit): string => {
  return `${weight} ${unit}`;
};

/**
 * Convert weight between different units
 */
export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first (base unit)
  let weightInGrams = weight;
  
  switch (fromUnit) {
    case 'lb':
      weightInGrams = weight * 453.592;
      break;
    case 'oz':
      weightInGrams = weight * 28.3495;
      break;
    case 'kg':
      weightInGrams = weight * 1000;
      break;
    case 'g':
      weightInGrams = weight;
      break;
  }
  
  // Convert from grams to target unit
  switch (toUnit) {
    case 'lb':
      return weightInGrams / 453.592;
    case 'oz':
      return weightInGrams / 28.3495;
    case 'kg':
      return weightInGrams / 1000;
    case 'g':
      return weightInGrams;
    default:
      return weight;
  }
};
