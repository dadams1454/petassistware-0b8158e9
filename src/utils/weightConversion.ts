
import { WeightUnit, standardizeWeightUnit, getWeightUnitInfo } from '@/types/weight-units';

/**
 * Convert a weight value to grams regardless of the original unit
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit | string): number {
  // Standardize the unit to make sure it's a valid WeightUnit
  const standardizedUnit = standardizeWeightUnit(unit);
  
  // Get the conversion factor for the unit
  const unitInfo = getWeightUnitInfo(standardizedUnit);
  
  // Calculate the weight in grams
  return weight * unitInfo.conversionToG;
}

/**
 * Convert weight from one unit to another
 */
export function convertWeight(
  weight: number, 
  fromUnit: WeightUnit | string, 
  toUnit: WeightUnit | string
): number {
  // Standardize the units
  const standardFromUnit = standardizeWeightUnit(fromUnit);
  const standardToUnit = standardizeWeightUnit(toUnit);
  
  // If the units are the same, no conversion needed
  if (standardFromUnit === standardToUnit) {
    return weight;
  }
  
  // Convert to grams first (as an intermediate step)
  const weightInGrams = convertWeightToGrams(weight, standardFromUnit);
  
  // Convert from grams to the target unit
  const toUnitInfo = getWeightUnitInfo(standardToUnit);
  
  return weightInGrams / toUnitInfo.conversionToG;
}

/**
 * Format weight with the appropriate unit display
 */
export function formatWeight(
  weight: number, 
  unit: WeightUnit | string, 
  options?: { precision?: number; includeUnit?: boolean }
): string {
  const standardUnit = standardizeWeightUnit(unit);
  const unitInfo = getWeightUnitInfo(standardUnit);
  
  // Determine precision (default to the unit's standard precision)
  const precision = options?.precision !== undefined ? options.precision : unitInfo.precision;
  
  // Format the number
  const formattedWeight = weight.toFixed(precision);
  
  // Add unit abbreviation if requested (default to true)
  const includeUnit = options?.includeUnit !== false;
  return includeUnit ? `${formattedWeight} ${unitInfo.abbreviation}` : formattedWeight;
}

/**
 * Determine the most appropriate weight unit based on the weight value and age
 */
export function getAppropriateWeightUnit(
  weight: number, 
  currentUnit: WeightUnit, 
  ageInDays: number
): WeightUnit {
  // Convert the weight to grams for comparison
  const weightInGrams = convertWeightToGrams(weight, currentUnit);
  
  // For very young puppies (under 2 weeks), use ounces if they're small
  if (ageInDays < 14 && weightInGrams < 500) {
    return 'oz';
  }
  
  // For puppies between 2-8 weeks, use ounces if they're small, else pounds
  if (ageInDays < 56) {
    return weightInGrams < 500 ? 'oz' : 'lb';
  }
  
  // For older puppies/dogs, use pounds
  if (weightInGrams >= 500 && weightInGrams < 20000) {
    return 'lb';
  }
  
  // For large dogs, use kilograms
  if (weightInGrams >= 20000) {
    return 'kg';
  }
  
  // Default to pounds for most dogs
  return 'lb';
}
