
import { WeightUnit, getWeightUnitInfo } from '@/types/weight-units';

/**
 * Converts a weight value to grams
 * @param weight The weight value to convert
 * @param unit The unit of the weight value
 * @returns The weight in grams
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit): number {
  const info = getWeightUnitInfo(unit);
  return weight * info.conversionToGrams;
}

/**
 * Converts a weight value from one unit to another
 * @param weight The weight value to convert
 * @param fromUnit The current unit of the weight
 * @param toUnit The target unit to convert to
 * @returns The converted weight value
 */
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first
  const weightInGrams = convertWeightToGrams(weight, fromUnit);
  
  // Then convert to target unit
  const toInfo = getWeightUnitInfo(toUnit);
  const result = weightInGrams / toInfo.conversionToGrams;
  
  // Round to appropriate precision
  const precision = toInfo.displayPrecision;
  const factor = Math.pow(10, precision);
  return Math.round(result * factor) / factor;
}

/**
 * Determines the most appropriate weight unit based on the weight value
 * @param weightInGrams The weight in grams
 * @returns The most appropriate weight unit
 */
export function getAppropriateWeightUnit(weightInGrams: number): WeightUnit {
  if (weightInGrams < 100) {
    return 'g';
  } else if (weightInGrams < 500) {
    return 'oz';
  } else if (weightInGrams < 10000) {
    return 'lb';
  } else {
    return 'kg';
  }
}

/**
 * Formats a weight value for display with the appropriate unit
 * @param weight The weight value
 * @param unit The unit of the weight value
 * @returns A formatted string with the weight and unit
 */
export function formatWeight(weight: number, unit: WeightUnit): string {
  const info = getWeightUnitInfo(unit);
  const precision = info.displayPrecision;
  const formattedWeight = weight.toFixed(precision);
  
  // Remove trailing zeros after decimal point
  const cleanedWeight = formattedWeight.replace(/\.0+$/, '');
  
  return `${cleanedWeight} ${info.label}`;
}

/**
 * Converts a weight record to a standard unit (grams) for comparison
 * @param weight The weight value
 * @param unit The unit of the weight value
 * @returns The weight in grams
 */
export function standardizeWeight(weight: number, unit: WeightUnit): number {
  return convertWeightToGrams(weight, unit);
}
