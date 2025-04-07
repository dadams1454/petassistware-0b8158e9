
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Convert a weight value to grams
 */
export const convertWeightToGrams = (weight: number, unit: WeightUnit): number => {
  const unitInfo = weightUnitInfos.find(info => info.value === unit);
  if (!unitInfo) {
    console.error(`Unknown weight unit: ${unit}`);
    return weight;
  }
  
  return weight * unitInfo.gramsPerUnit;
};

/**
 * Convert a weight value from one unit to another
 */
export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) return weight;
  
  // First convert to grams
  const weightInGrams = convertWeightToGrams(weight, fromUnit);
  
  // Then convert from grams to target unit
  const targetUnitInfo = weightUnitInfos.find(info => info.value === toUnit);
  if (!targetUnitInfo) {
    console.error(`Unknown target weight unit: ${toUnit}`);
    return weight;
  }
  
  return weightInGrams / targetUnitInfo.gramsPerUnit;
};

/**
 * Format a weight with its unit for display
 */
export const formatWeight = (weight: number, unit: WeightUnit): string => {
  // Find the unit info to get display information
  const unitInfo = weightUnitInfos.find(info => info.value === unit);
  if (!unitInfo) {
    return `${weight} ${unit}`;
  }
  
  // Format the number based on the precision we want
  const formattedWeight = weight.toFixed(unitInfo.displayPrecision);
  
  // Return formatted weight with unit
  return `${formattedWeight} ${unitInfo.displayUnit || unitInfo.value}`;
};
