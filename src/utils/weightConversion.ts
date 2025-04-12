
import { WeightUnit, getWeightUnitInfo, weightUnitInfos } from '@/types/weight-units';

/**
 * Convert weight to grams
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit): number {
  const unitInfo = getWeightUnitInfo(unit);
  return weight * unitInfo.toGrams;
}

/**
 * Convert weight between units
 */
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  // Convert to grams first
  const weightInGrams = convertWeightToGrams(weight, fromUnit);
  
  // Then convert from grams to target unit
  const targetUnitInfo = getWeightUnitInfo(toUnit);
  return weightInGrams / targetUnitInfo.toGrams;
}

/**
 * Format weight with appropriate precision
 */
export function formatWeight(weight: number, unit: WeightUnit): string {
  const unitInfo = getWeightUnitInfo(unit);
  return `${weight.toFixed(unitInfo.precision)} ${unitInfo.displayName}`;
}

/**
 * Get appropriate weight unit based on the weight value
 */
export function getAppropriateWeightUnit(weightInGrams: number, preferImperial = false): WeightUnit {
  if (preferImperial) {
    // Imperial units
    return weightInGrams < 453.592 ? 'oz' : 'lb';
  } else {
    // Metric units
    return weightInGrams < 1000 ? 'g' : 'kg';
  }
}

/**
 * Calculate percent change between two weights
 */
export function calculatePercentChange(oldWeight: number, newWeight: number): number {
  if (oldWeight === 0) return 0;
  return ((newWeight - oldWeight) / oldWeight) * 100;
}

/**
 * Normalize weight for consistent comparison
 */
export function normalizeWeight(weight: { value: number, unit: WeightUnit }): number {
  return convertWeightToGrams(weight.value, weight.unit);
}
