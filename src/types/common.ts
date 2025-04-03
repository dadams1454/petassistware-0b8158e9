
/**
 * Common types shared across the application
 */

// Weight unit type that can be used throughout the app
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// For backward compatibility with code that might use 'lbs'
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// Weight unit option for UI components
export interface WeightUnitOption {
  code: WeightUnit;
  name: string;
}

/**
 * Standardize weight unit to ensure consistency
 * Handles potential variations like 'lbs' -> 'lb'
 */
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  // Convert to lowercase for consistent comparison
  const lowerUnit = unit.toLowerCase();
  
  // Handle common variations
  if (lowerUnit === 'lbs' || lowerUnit === 'pound' || lowerUnit === 'pounds') {
    return 'lb';
  }
  if (lowerUnit === 'g' || lowerUnit === 'gram' || lowerUnit === 'grams') {
    return 'g';
  }
  if (lowerUnit === 'kg' || lowerUnit === 'kilogram' || lowerUnit === 'kilograms') {
    return 'kg';
  }
  if (lowerUnit === 'oz' || lowerUnit === 'ounce' || lowerUnit === 'ounces') {
    return 'oz';
  }
  
  // Default to ounces if unit is not recognized
  return 'oz';
};

/**
 * Interface for handling API errors
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

/**
 * Basic metadata interface for timestamps
 */
export interface TimeStamps {
  created_at: string;
  updated_at?: string;
}

/**
 * Interface for pagination controls
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Interface for sort options
 */
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Base entity interface all domain objects extend from
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
  tenant_id?: string;
}

// Export the weight units array for UI components
export const weightUnits: WeightUnitOption[] = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'g', name: 'Grams' }
];

/**
 * Get the human-readable name for a weight unit
 */
export const getWeightUnitName = (unit: WeightUnit): string => {
  const foundUnit = weightUnits.find(u => u.code === unit);
  return foundUnit ? foundUnit.name : 'Unknown';
};

/**
 * Format weight with unit for display
 */
export const formatWeightWithUnit = (weight: number, unit: WeightUnit): string => {
  return `${weight} ${unit}`;
};

/**
 * Convert weight between different units
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnit | WeightUnitWithLegacy,
  toUnit: WeightUnit
): number => {
  // Handle legacy 'lbs' -> 'lb' conversion
  const standardFromUnit = fromUnit === 'lbs' ? 'lb' : fromUnit as WeightUnit;
  
  if (standardFromUnit === toUnit) {
    return weight;
  }

  // Convert to grams first (base unit)
  let weightInGrams = 0;
  
  switch (standardFromUnit) {
    case 'g':
      weightInGrams = weight;
      break;
    case 'kg':
      weightInGrams = weight * 1000;
      break;
    case 'oz':
      weightInGrams = weight * 28.3495;
      break;
    case 'lb':
      weightInGrams = weight * 453.59237;
      break;
    default:
      weightInGrams = weight;
      break;
  }
  
  // Convert from grams to target unit
  switch (toUnit) {
    case 'g':
      return weightInGrams;
    case 'kg':
      return weightInGrams / 1000;
    case 'oz':
      return weightInGrams / 28.3495;
    case 'lb':
      return weightInGrams / 453.59237;
    default:
      return weight;
  }
};
