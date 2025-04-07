
/**
 * Weight conversion and formatting utilities
 */
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Convert weight from one unit to another
 * 
 * @param {number} weight The weight value to convert
 * @param {WeightUnit} fromUnit The unit to convert from
 * @param {WeightUnit} toUnit The unit to convert to
 * @returns {number} The converted weight value
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number => {
  if (fromUnit === toUnit) return weight;
  
  // First convert to grams (our base unit)
  const weightInGrams = weight * weightUnitInfos[fromUnit].conversionToGrams;
  
  // Then convert from grams to the target unit
  return weightInGrams / weightUnitInfos[toUnit].conversionToGrams;
};

/**
 * Convert weight to grams (our base unit for calculations)
 * 
 * @param {number} weight The weight value to convert
 * @param {WeightUnit} unit The unit to convert from
 * @returns {number} The weight in grams
 */
export const convertWeightToGrams = (weight: number, unit: WeightUnit): number => {
  return weight * weightUnitInfos[unit].conversionToGrams;
};

/**
 * Format a weight value for display
 * 
 * @param {number} weight The weight value to format
 * @param {WeightUnit} unit The unit of the weight
 * @returns {string} The formatted weight string
 */
export const formatWeight = (weight: number, unit: WeightUnit): string => {
  if (weight === null || weight === undefined) return 'N/A';
  
  const info = weightUnitInfos[unit];
  const formatted = weight.toFixed(info.decimalPlaces);
  
  return `${formatted} ${info.displayName}`;
};

/**
 * Get the appropriate weight unit based on the weight in grams
 * 
 * @param {number} weightInGrams The weight in grams
 * @returns {WeightUnit} The appropriate weight unit
 */
export const getAppropriateWeightUnit = (weightInGrams: number): WeightUnit => {
  if (weightInGrams < 100) {
    return 'g';
  } else if (weightInGrams < 1000) {
    return 'g';
  } else if (weightInGrams < 10000) {
    return 'kg';
  } else {
    return 'kg';
  }
};

/**
 * Calculate the percent change between two weight values
 * 
 * @param {number} oldWeight The old weight value
 * @param {number} newWeight The new weight value
 * @returns {number} The percent change value
 */
export const calculatePercentChange = (oldWeight: number, newWeight: number): number => {
  if (oldWeight === 0) return 0;
  return ((newWeight - oldWeight) / oldWeight) * 100;
};
