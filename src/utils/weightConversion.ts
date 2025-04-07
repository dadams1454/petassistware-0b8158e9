
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Converts a weight from one unit to grams
 * @param weight Weight value to convert
 * @param unit Source weight unit
 * @returns Equivalent weight in grams
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit): number {
  const unitInfo = weightUnitInfos.find(info => info.unit === unit);
  if (!unitInfo) {
    console.warn(`Unknown weight unit: ${unit}, using oz as default`);
    return weight * 28.3495; // Default to oz conversion
  }
  
  return weight * unitInfo.toGrams;
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
  const targetUnitInfo = weightUnitInfos.find(info => info.unit === toUnit);
  if (!targetUnitInfo) {
    console.warn(`Unknown target weight unit: ${toUnit}, using g as default`);
    return weightInGrams;
  }
  
  return weightInGrams / targetUnitInfo.toGrams;
}

/**
 * Format a weight value for display with the appropriate unit and precision
 * @param weight Weight value to format
 * @param unit Weight unit
 * @returns Formatted weight string (e.g., "5.2 kg")
 */
export function formatWeight(weight: number, unit: WeightUnit): string {
  const unitInfo = weightUnitInfos.find(info => info.unit === unit);
  if (!unitInfo) {
    return `${weight} ${unit}`;
  }
  
  const precision = unitInfo.precision;
  
  if (precision === 0) {
    return `${Math.round(weight)} ${unit}`;
  } else {
    return `${weight.toFixed(precision)} ${unit}`;
  }
}

/**
 * Determine the most appropriate weight unit based on the weight in grams
 * @param weightInGrams Weight in grams
 * @returns The most appropriate weight unit for display
 */
export function getAppropriateWeightUnit(weightInGrams: number): WeightUnit {
  // If very small weight
  if (weightInGrams < 1000) { // Less than 1kg
    return 'g';  // Use grams
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
