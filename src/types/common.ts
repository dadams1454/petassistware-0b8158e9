
/**
 * Common types used across the application
 */

/**
 * Standard weight unit type used throughout the application
 * Using union type instead of enum for better type safety
 */
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';

/**
 * For backward compatibility with older code that uses 'lbs' instead of 'lb'
 */
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

/**
 * Helper function to standardize weight units
 * Converts legacy units to standard format
 */
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  if (['lb', 'kg', 'oz', 'g'].includes(unit)) return unit as WeightUnit;
  return 'lb'; // Default to lb if unknown unit
};

/**
 * Helper function to format weight with unit
 */
export const formatWeightWithUnit = (weight: number, unit: WeightUnit | string): string => {
  const standardUnit = standardizeWeightUnit(unit);
  return `${weight} ${standardUnit}`;
};

/**
 * Helper function to get human-readable weight unit name
 */
export const getWeightUnitName = (unit: string): string => {
  const unitMap: Record<string, string> = {
    'g': 'Grams',
    'kg': 'Kilograms',
    'oz': 'Ounces',
    'lb': 'Pounds',
    'lbs': 'Pounds'
  };

  return unitMap[unit] || 'Pounds';
};
