
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Converts a weight value from one unit to another
 */
export const convertWeight = (
  weight: number, 
  fromUnit: WeightUnit, 
  toUnit: WeightUnit
): number => {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  // Find the unit info objects
  const fromUnitInfo = weightUnitInfos.find(u => u.value === fromUnit);
  const toUnitInfo = weightUnitInfos.find(u => u.value === toUnit);
  
  if (!fromUnitInfo || !toUnitInfo) {
    console.error(`Conversion failed: Unknown units - from ${fromUnit} to ${toUnit}`);
    return weight;
  }
  
  // Convert to grams first (intermediate step)
  const weightInGrams = weight * fromUnitInfo.gramsPerUnit;
  
  // Convert from grams to target unit
  return weightInGrams / toUnitInfo.gramsPerUnit;
};

/**
 * Converts a weight to grams for standardized calculations
 */
export const convertWeightToGrams = (
  weight: number, 
  unit: WeightUnit
): number => {
  return convertWeight(weight, unit, 'g');
};

/**
 * Formats a weight value with the appropriate precision for its unit
 */
export const formatWeight = (
  weight: number, 
  unit: WeightUnit
): string => {
  const unitInfo = weightUnitInfos.find(u => u.value === unit);
  
  if (!unitInfo) {
    return weight.toString();
  }
  
  return weight.toFixed(unitInfo.precision);
};

/**
 * Gets the appropriate weight unit based on age and weight
 */
export const getAppropriateWeightUnit = (
  weight: number, 
  currentUnit: WeightUnit, 
  ageInDays: number
): WeightUnit => {
  const weightInGrams = convertWeightToGrams(weight, currentUnit);
  
  // For very young puppies (less than 14 days), use ounces if they're small
  if (ageInDays < 14 && weightInGrams < 1000) {
    return 'oz';
  }
  
  // For puppies between 2-8 weeks, use pounds if they're over 500g
  if (ageInDays < 56 && weightInGrams >= 500) {
    return 'lb';
  }
  
  // For older puppies and small breeds, use pounds
  if (weightInGrams >= 1000) {
    return 'lb';
  }
  
  // For larger dogs, use kilograms if over 20kg
  if (weightInGrams >= 20000) {
    return 'kg';
  }
  
  // Default to ounces for very small puppies
  return 'oz';
};

/**
 * Calculate percent change between two weight values
 */
export const calculatePercentChange = (
  oldWeight: number, 
  newWeight: number
): number => {
  if (oldWeight === 0) return 0; // Prevent division by zero
  // Calculate percentage change
  const change = ((newWeight - oldWeight) / oldWeight) * 100;
  // Return the rounded value to 1 decimal place
  return Math.round(change * 10) / 10;
};
