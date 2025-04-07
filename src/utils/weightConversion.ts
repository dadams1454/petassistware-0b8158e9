
import { WeightUnit, weightUnitInfos } from '@/types/common';

/**
 * Converts a weight value from one unit to grams
 * @param weight The weight value to convert
 * @param unit The source unit (oz, g, lb, kg)
 * @returns The weight in grams
 */
export const convertWeightToGrams = (weight: number, unit: WeightUnit): number => {
  const unitInfo = weightUnitInfos.find(u => u.id === unit);
  if (!unitInfo) {
    console.error(`Invalid weight unit: ${unit}`);
    return weight; // Return original weight if unit not found
  }
  
  return weight * unitInfo.conversionToG;
};

/**
 * Converts a weight value from one unit to another
 * @param weight The weight value to convert
 * @param fromUnit The source unit
 * @param toUnit The target unit
 * @returns The converted weight value
 */
export const convertWeight = (
  weight: number, 
  fromUnit: WeightUnit, 
  toUnit: WeightUnit
): number => {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  // Convert to grams first as an intermediate step
  const weightInGrams = convertWeightToGrams(weight, fromUnit);
  
  // Convert from grams to target unit
  const toUnitInfo = weightUnitInfos.find(u => u.id === toUnit);
  if (!toUnitInfo) {
    console.error(`Invalid target weight unit: ${toUnit}`);
    return weight;
  }
  
  return weightInGrams / toUnitInfo.conversionToG;
};

/**
 * Gets the appropriate weight unit for a puppy based on age and weight
 * @param weight The weight value
 * @param currentUnit The current weight unit
 * @param ageInDays Age of the puppy in days
 * @returns The appropriate weight unit
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
