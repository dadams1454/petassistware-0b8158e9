
import { WeightUnit, convertWeight as convertWeightBase, getAppropriateWeightUnit } from '@/types/weight-units';

/**
 * Converts a weight value from one unit to grams
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit): number {
  return convertWeightBase(weight, unit, 'g');
}

/**
 * Wraps the core convert weight function for broader compatibility
 */
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  return convertWeightBase(weight, fromUnit, toUnit);
}

/**
 * Formats a weight value with its unit for display
 */
export function formatWeight(weight: number, unit: WeightUnit): string {
  switch (unit) {
    case 'oz':
      return `${weight.toFixed(1)} oz`;
    case 'g':
      return `${Math.round(weight)} g`;
    case 'lb':
      return `${weight.toFixed(1)} lb`;
    case 'kg':
      return `${weight.toFixed(2)} kg`;
    default:
      return `${weight} ${unit}`;
  }
}

/**
 * Export the appropriate weight unit calculation for compatibility
 */
export { getAppropriateWeightUnit };
