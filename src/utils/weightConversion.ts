
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Converts a weight value from one unit to another
 */
export const convertWeight = (
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number => {
  // Don't convert if units are the same
  if (fromUnit === toUnit) return value;
  
  // Find conversion factors
  const fromInfo = weightUnitInfos.find(info => info.unit === fromUnit);
  const toInfo = weightUnitInfos.find(info => info.unit === toUnit);
  
  if (!fromInfo || !toInfo) {
    console.error(`Invalid weight units: ${fromUnit} -> ${toUnit}`);
    return value;
  }
  
  // Convert to grams first, then to target unit
  const valueInGrams = value * fromInfo.toGrams;
  const convertedValue = valueInGrams / toInfo.toGrams;
  
  return convertedValue;
};

/**
 * Converts a weight value to grams
 */
export const convertWeightToGrams = (
  value: number,
  unit: WeightUnit
): number => {
  return convertWeight(value, unit, 'g');
};

/**
 * Formats a weight value for display
 */
export const formatWeight = (
  value: number,
  unit: WeightUnit
): string => {
  const info = weightUnitInfos.find(info => info.unit === unit);
  
  if (!info) {
    console.error(`Invalid weight unit: ${unit}`);
    return `${value} ${unit}`;
  }
  
  const formatted = value.toFixed(info.precision);
  return `${formatted} ${info.label}`;
};

/**
 * Gets the appropriate weight unit based on weight value in grams
 */
export const getAppropriateWeightUnit = (
  weightInGrams: number
): WeightUnit => {
  // Default to oz
  if (weightInGrams <= 0) return 'oz';
  
  // Find appropriate unit based on thresholds
  for (const info of weightUnitInfos) {
    if (info.thresholds && 
        weightInGrams >= info.thresholds.min && 
        weightInGrams < info.thresholds.max) {
      return info.unit;
    }
  }
  
  // If nothing matched, use kg for large weights, oz for small
  return weightInGrams > 1000 ? 'kg' : 'oz';
};

/**
 * Calculates percent change between two weight values
 */
export const calculatePercentChange = (
  oldWeight: number,
  newWeight: number
): number => {
  if (oldWeight === 0) return 0;
  return ((newWeight - oldWeight) / oldWeight) * 100;
};
