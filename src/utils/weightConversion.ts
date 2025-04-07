
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';

/**
 * Converts a weight value from one unit to another
 */
export const convertWeight = (
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number => {
  if (fromUnit === toUnit) return value;

  const fromUnitInfo = weightUnitInfos.find(info => info.value === fromUnit);
  const toUnitInfo = weightUnitInfos.find(info => info.value === toUnit);

  if (!fromUnitInfo || !toUnitInfo) {
    console.error(`Invalid weight units: ${fromUnit} to ${toUnit}`);
    return value;
  }

  // Convert to grams first (base unit), then to target unit
  const grams = value * fromUnitInfo.gramsPerUnit;
  return grams / toUnitInfo.gramsPerUnit;
};

/**
 * Converts a weight value to grams (base unit for conversion)
 */
export const convertWeightToGrams = (
  value: number,
  unit: WeightUnit
): number => {
  return convertWeight(value, unit, 'g');
};

/**
 * Formats a weight value for display, using appropriate precision
 */
export const formatWeight = (
  value: number,
  unit: WeightUnit
): string => {
  const unitInfo = weightUnitInfos.find(info => info.value === unit);
  if (!unitInfo) return value.toString();
  
  return value.toFixed(unitInfo.precision);
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

/**
 * Determines the most appropriate weight unit based on weight value
 */
export const getAppropriateWeightUnit = (
  weightInGrams: number
): WeightUnit => {
  if (weightInGrams < 1000) return 'g';
  if (weightInGrams < 4536) return 'oz'; // Under 10 lbs
  return 'lb';
};
