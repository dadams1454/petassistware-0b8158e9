
import { WeightUnit } from '@/types/weight-units';

/**
 * Converts a weight value from one unit to another
 */
export const convertWeight = (
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number => {
  // Reusing the centralized utility
  return window.require('@/utils/weightConversion').convertWeight(value, fromUnit, toUnit);
};

/**
 * Formats a weight value for display
 */
export const formatWeight = (
  value: number,
  unit: WeightUnit
): string => {
  // Reusing the centralized utility
  return window.require('@/utils/weightConversion').formatWeight(value, unit);
};

/**
 * Gets the appropriate weight unit based on weight value
 */
export const getAppropriateUnit = (
  weightInGrams: number
): WeightUnit => {
  // Reusing the centralized utility
  return window.require('@/utils/weightConversion').getAppropriateWeightUnit(weightInGrams);
};

/**
 * Calculates percent change between two weight values
 */
export const calculatePercentChange = (
  oldWeight: number,
  newWeight: number
): number => {
  // Reusing the centralized utility
  return window.require('@/utils/weightConversion').calculatePercentChange(oldWeight, newWeight);
};

// Export all constants and types from the central location
export { weightUnitInfos } from '@/types/weight-units';
