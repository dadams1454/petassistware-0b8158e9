
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

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

// Convert weight from one unit to another
export const convertWeight = (
  weight: number, 
  fromUnit: WeightUnit, 
  toUnit: WeightUnit
): number => {
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

// Function to get the appropriate weight unit for a puppy based on age and weight
export const getAppropriateWeightUnit = (
  weight: number, 
  currentUnit: WeightUnit, 
  ageInDays: number
): WeightUnit => {
  const weightInGrams = convertWeight(weight, currentUnit, WeightUnit.GRAMS);
  
  // For very young puppies (less than 14 days), use ounces if they're small
  if (ageInDays < 14 && weightInGrams < 1000) {
    return WeightUnit.OUNCES;
  }
  
  // For puppies between 2-8 weeks, use pounds if they're over 500g
  if (ageInDays < 56 && weightInGrams >= 500) {
    return WeightUnit.POUNDS;
  }
  
  // For older puppies and small breeds, use pounds
  if (weightInGrams >= 1000) {
    return WeightUnit.POUNDS;
  }
  
  // For larger dogs, use kilograms if over 20kg
  if (weightInGrams >= 20000) {
    return WeightUnit.KILOGRAMS;
  }
  
  // Default to ounces for very small puppies
  return WeightUnit.OUNCES;
};

// Export the WeightUnit type from the canonical location
export type { WeightUnit } from '@/types/weight-units';
