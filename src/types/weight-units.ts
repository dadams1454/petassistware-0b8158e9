
/**
 * Centralized definitions for weight units used throughout the application
 */

// Weight unit type definition (string literal union)
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit information structure
export interface WeightUnitInfo {
  unit: WeightUnit;
  label: string; // Human-readable label
  name: string;  // Also used as label in some components
  conversionToGrams: number;
  conversionToG: number; // For backward compatibility
  displayPrecision: number;
}

// Weight unit option for UI selects
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Weight unit information
export const weightUnitInfos: WeightUnitInfo[] = [
  { unit: 'g', label: 'Grams', name: 'Grams', conversionToGrams: 1, conversionToG: 1, displayPrecision: 0 },
  { unit: 'oz', label: 'Ounces', name: 'Ounces', conversionToGrams: 28.3495, conversionToG: 28.3495, displayPrecision: 1 },
  { unit: 'lb', label: 'Pounds', name: 'Pounds', conversionToGrams: 453.592, conversionToG: 453.592, displayPrecision: 1 },
  { unit: 'kg', label: 'Kilograms', name: 'Kilograms', conversionToGrams: 1000, conversionToG: 1000, displayPrecision: 1 }
];

// Helper function to get weight unit info
export const getWeightUnitInfo = (unit: WeightUnit): WeightUnitInfo => {
  const info = weightUnitInfos.find(info => info.unit === unit);
  return info || weightUnitInfos[0];
};

// Helper function to get weight unit name
export const getWeightUnitName = (unit: WeightUnit): string => {
  return getWeightUnitInfo(unit).label;
};

// Weight unit options for select inputs
export const weightUnitOptions: WeightUnitOption[] = weightUnitInfos.map(info => ({
  value: info.unit,
  label: info.label
}));

// Weight units array for validation
export const weightUnits: WeightUnit[] = ['g', 'oz', 'lb', 'kg'];

// Function to standardize weight unit to enum value
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const normalizedUnit = unit?.toLowerCase?.() || '';
  
  switch (normalizedUnit) {
    case 'gram':
    case 'grams':
    case 'g':
      return 'g';
    case 'ounce':
    case 'ounces':
    case 'oz':
      return 'oz';
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
      return 'lb'; // Default to pounds
  }
};

// Conversion helpers
export const convertWeightToGrams = (weight: number, unit: WeightUnit): number => {
  const info = getWeightUnitInfo(unit);
  return weight * info.conversionToGrams;
};

export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first
  const weightInGrams = convertWeightToGrams(weight, fromUnit);
  
  // Then convert from grams to target unit
  const toUnitInfo = getWeightUnitInfo(toUnit);
  return weightInGrams / toUnitInfo.conversionToGrams;
};

export const formatWeight = (weight: number, unit: WeightUnit): string => {
  const unitInfo = getWeightUnitInfo(unit);
  return weight.toFixed(unitInfo.displayPrecision);
};
