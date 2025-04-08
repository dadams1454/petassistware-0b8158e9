
/**
 * Weight conversion utility functions
 */
import { WeightUnit, standardizeWeightUnit, getWeightUnitInfo } from '@/types/weight-units';

/**
 * Convert a weight to grams (standard unit for calculations)
 * @param weight The weight value
 * @param unit The unit of the weight
 * @returns The weight in grams
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit | string): number {
  const standardUnit = standardizeWeightUnit(unit);
  const info = getWeightUnitInfo(standardUnit);
  return weight * info.toGrams;
}

/**
 * Convert a weight from one unit to another
 * @param weight The weight value
 * @param fromUnit The current unit
 * @param toUnit The target unit
 * @returns The converted weight
 */
export function convertWeight(weight: number, fromUnit: WeightUnit | string, toUnit: WeightUnit | string): number {
  const standardFromUnit = standardizeWeightUnit(fromUnit);
  const standardToUnit = standardizeWeightUnit(toUnit);
  
  if (standardFromUnit === standardToUnit) {
    return weight;
  }
  
  // Convert to grams first, then to target unit
  const weightInGrams = convertWeightToGrams(weight, standardFromUnit);
  const toUnitInfo = getWeightUnitInfo(standardToUnit);
  
  return weightInGrams / toUnitInfo.toGrams;
}

/**
 * Format a weight with the appropriate precision and unit
 * @param weight The weight value
 * @param unit The unit of the weight
 * @returns Formatted weight string (e.g. "4.5 lb")
 */
export function formatWeight(weight: number, unit: WeightUnit | string): string {
  const standardUnit = standardizeWeightUnit(unit);
  const info = getWeightUnitInfo(standardUnit);
  
  return `${weight.toFixed(info.precision)} ${info.abbreviation}`;
}

/**
 * Calculate the percentage change between two weights
 * @param oldWeight Previous weight
 * @param newWeight Current weight
 * @returns Percentage change
 */
export function calculatePercentChange(oldWeight: number, newWeight: number): number {
  if (oldWeight === 0) return 0; // Prevent division by zero
  return ((newWeight - oldWeight) / oldWeight) * 100;
}

/**
 * Determine the most appropriate weight unit based on weight value
 * @param weightInGrams Weight in grams
 * @returns Most appropriate unit
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
