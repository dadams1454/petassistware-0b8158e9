
import { WeightUnit } from '@/types/common';

/**
 * Formats a weight value with the appropriate unit
 * @param weight The numeric weight value
 * @param unit The weight unit (lb, kg, oz, g)
 * @returns Formatted weight string with unit
 */
export const formatWeight = (weight: number, unit: WeightUnit): string => {
  if (weight === null || weight === undefined) {
    return 'N/A';
  }
  
  return `${weight} ${unit}`;
};

/**
 * Converts a weight from one unit to another
 * @param weight The weight value to convert
 * @param fromUnit The unit to convert from
 * @param toUnit The unit to convert to
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
  
  // Convert to grams first (base unit)
  let weightInGrams = 0;
  
  switch (fromUnit) {
    case 'g':
      weightInGrams = weight;
      break;
    case 'kg':
      weightInGrams = weight * 1000;
      break;
    case 'oz':
      weightInGrams = weight * 28.3495;
      break;
    case 'lb':
      weightInGrams = weight * 453.592;
      break;
  }
  
  // Convert from grams to target unit
  switch (toUnit) {
    case 'g':
      return weightInGrams;
    case 'kg':
      return weightInGrams / 1000;
    case 'oz':
      return weightInGrams / 28.3495;
    case 'lb':
      return weightInGrams / 453.592;
    default:
      return weight; // Default to same weight if unit not recognized
  }
};

/**
 * Calculates weight change percentage between two weight values
 * (ensures both are in the same unit first)
 */
export const calculateWeightChangePercentage = (
  previousWeight: number,
  previousUnit: WeightUnit,
  currentWeight: number,
  currentUnit: WeightUnit
): number => {
  // Convert both weights to the same unit (grams)
  const prevWeightInGrams = convertWeight(previousWeight, previousUnit, 'g');
  const currWeightInGrams = convertWeight(currentWeight, currentUnit, 'g');
  
  // Calculate percentage change
  const change = ((currWeightInGrams - prevWeightInGrams) / prevWeightInGrams) * 100;
  
  // Round to 1 decimal place
  return Math.round(change * 10) / 10;
};

/**
 * Determines growth rate status based on percentage change
 */
export const getGrowthRateStatus = (percentChange: number): 'normal' | 'slow' | 'rapid' => {
  if (percentChange < 5) {
    return 'slow';
  } else if (percentChange > 15) {
    return 'rapid';
  } else {
    return 'normal';
  }
};
