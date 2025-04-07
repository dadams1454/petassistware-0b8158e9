
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Convert weight from any unit to grams
 */
export const convertWeightToGrams = (weight: number, unit: WeightUnit): number => {
  const unitInfo = weightUnitInfos.find(u => u.value === unit);
  if (!unitInfo) {
    console.error(`Unknown weight unit: ${unit}`);
    return weight;
  }
  return weight * unitInfo.gramsPerUnit;
};

/**
 * Convert weight from one unit to another
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
  
  // Convert from grams to the target unit
  const toUnitInfo = weightUnitInfos.find(u => u.value === toUnit);
  if (!toUnitInfo) {
    console.error(`Unknown target weight unit: ${toUnit}`);
    return weight;
  }
  
  // Convert from grams to the target unit
  return weightInGrams / toUnitInfo.gramsPerUnit;
};

/**
 * Format weight for display with appropriate units
 */
export const formatWeight = (
  weight: number, 
  unit: WeightUnit
): string => {
  const unitInfo = weightUnitInfos.find(u => u.value === unit);
  if (!unitInfo) {
    return `${weight} ${unit}`;
  }
  
  const formattedValue = Number(weight).toFixed(unitInfo.displayPrecision);
  return `${formattedValue} ${unitInfo.displayUnit}`;
};

/**
 * Function to determine the appropriate weight unit based on age and weight
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
