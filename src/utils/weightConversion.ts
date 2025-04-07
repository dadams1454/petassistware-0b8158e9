
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Converts a weight from one unit to another
 */
export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  // Convert to grams first as an intermediate step
  const fromUnitInfo = weightUnitInfos.find(u => u.value === fromUnit);
  const toUnitInfo = weightUnitInfos.find(u => u.value === toUnit);
  
  if (!fromUnitInfo || !toUnitInfo) {
    console.error(`Conversion failed: Unknown units - from ${fromUnit} to ${toUnit}`);
    return weight;
  }
  
  // Calculate the weight in grams
  const weightInGrams = weight * fromUnitInfo.gramsPerUnit;
  
  // Convert from grams to the target unit
  return weightInGrams / toUnitInfo.gramsPerUnit;
};

/**
 * Converts a weight to grams
 */
export const convertWeightToGrams = (weight: number, unit: WeightUnit): number => {
  return convertWeight(weight, unit, 'g');
};

/**
 * Formats a weight for display with the appropriate unit
 */
export const formatWeight = (weight: number, unit: WeightUnit): string => {
  const unitInfo = weightUnitInfos.find(u => u.value === unit);
  
  if (!unitInfo) {
    return `${weight} ${unit}`;
  }
  
  const formattedWeight = weight.toFixed(unitInfo.precision);
  return `${formattedWeight} ${unit}`;
};

/**
 * Gets the appropriate weight unit for a weight value
 */
export const getAppropriateWeightUnit = (
  weight: number, 
  currentUnit: WeightUnit, 
  ageInDays: number
): WeightUnit => {
  const weightInGrams = convertWeight(weight, currentUnit, 'g');
  
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
  oldWeight: { weight: number, unit: WeightUnit }, 
  newWeight: { weight: number, unit: WeightUnit }
): number => {
  if (oldWeight.weight === 0) return 0; // Prevent division by zero
  
  // Convert both weights to the same unit (grams) for comparison
  const oldWeightInGrams = convertWeightToGrams(oldWeight.weight, oldWeight.unit);
  const newWeightInGrams = convertWeightToGrams(newWeight.weight, newWeight.unit);
  
  // Calculate percentage change
  const change = ((newWeightInGrams - oldWeightInGrams) / oldWeightInGrams) * 100;
  
  // Return the rounded value to 1 decimal place
  return Math.round(change * 10) / 10;
};
