
import { WeightUnit, getWeightUnitInfo } from '@/types/weight-units';

/**
 * Convert weight from one unit to another
 * @param value The weight value to convert
 * @param fromUnit The unit to convert from
 * @param toUnit The unit to convert to
 * @returns The converted weight value
 */
export function convertWeight(value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return value;

  // Convert to grams first
  const fromInfo = getWeightUnitInfo(fromUnit);
  const valueInGrams = value * fromInfo.toGrams;

  // Then convert to target unit
  const toInfo = getWeightUnitInfo(toUnit);
  return valueInGrams / toInfo.toGrams;
}

/**
 * Convert weight to grams
 * @param value The weight value
 * @param unit The unit the weight is in
 * @returns The weight in grams
 */
export function convertWeightToGrams(value: number, unit: WeightUnit): number {
  const unitInfo = getWeightUnitInfo(unit);
  return value * unitInfo.toGrams;
}

/**
 * Format a weight value with the appropriate unit and precision
 * @param value The weight value
 * @param unit The weight unit
 * @returns Formatted weight string (e.g., "2.5 lbs")
 */
export function formatWeight(value: number, unit: WeightUnit): string {
  const unitInfo = getWeightUnitInfo(unit);
  return `${value.toFixed(unitInfo.precision)} ${unitInfo.abbreviation}`;
}

/**
 * Calculate the appropriate weight unit based on the weight in grams
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
 * Calculate the percent change between two weight values
 * @param oldWeight The old weight value
 * @param newWeight The new weight value
 * @returns The percent change as a number (e.g., 25.5 for 25.5%)
 */
export function calculatePercentChange(oldWeight: number, newWeight: number): number {
  if (oldWeight === 0) return 0;
  return ((newWeight - oldWeight) / oldWeight) * 100;
}
