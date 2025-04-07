
import { WeightUnit, weightUnitInfos, getWeightUnitInfo } from '@/types/weight-units';

/**
 * Converts a weight from one unit to grams
 * @param weight Weight value to convert
 * @param unit Source weight unit
 * @returns Equivalent weight in grams
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit): number {
  const unitInfo = getWeightUnitInfo(unit);
  return weight * unitInfo.toGramsFactor;
}

/**
 * Converts a weight from one unit to another
 * @param weight Weight value to convert
 * @param fromUnit Source weight unit
 * @param toUnit Target weight unit
 * @returns Converted weight value
 */
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  // Convert to grams first (common intermediate unit)
  const weightInGrams = convertWeightToGrams(weight, fromUnit);
  
  // Then convert from grams to target unit
  const targetUnitInfo = getWeightUnitInfo(toUnit);
  return weightInGrams / targetUnitInfo.toGramsFactor;
}

/**
 * Format a weight value for display with the appropriate unit and precision
 * @param weight Weight value to format
 * @param unit Weight unit
 * @returns Formatted weight string (e.g., "5.2 kg")
 */
export function formatWeight(weight: number, unit: WeightUnit): string {
  const unitInfo = getWeightUnitInfo(unit);
  
  const precision = unitInfo.displayPrecision;
  
  if (precision === 0) {
    return `${Math.round(weight)}`;
  } else {
    return `${weight.toFixed(precision)}`;
  }
}

/**
 * Determine the most appropriate weight unit based on the weight in grams
 * @param weightInGrams Weight in grams
 * @returns The most appropriate weight unit for display
 */
export function getAppropriateWeightUnit(weightInGrams: number): WeightUnit {
  if (weightInGrams < 100) { // Less than 100g
    return 'g';  // Use grams
  } else if (weightInGrams < 1000) { // Less than 1kg
    return 'oz'; // Use ounces
  } else if (weightInGrams < 10000) { // Less than 10kg
    return 'lb'; // Use pounds
  } else {
    return 'kg'; // Use kilograms
  }
}

/**
 * Calculate the percentage change between two weight values
 * @param oldWeight Old weight value
 * @param newWeight New weight value
 * @returns Percentage change (positive for gain, negative for loss)
 */
export function calculatePercentChange(oldWeight: number, newWeight: number): number {
  if (oldWeight === 0) {
    return 0; // Avoid division by zero
  }
  
  const change = ((newWeight - oldWeight) / oldWeight) * 100;
  return Math.round(change * 10) / 10; // Round to 1 decimal place
}
