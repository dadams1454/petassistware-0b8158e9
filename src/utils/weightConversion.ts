
/**
 * Weight conversion utilities
 */
import { 
  WeightUnit, 
  weightUnitInfos,
  standardizeWeightUnit 
} from '@/types/weight-units';

/**
 * Convert weight from one unit to another
 * 
 * @param weight The weight value to convert
 * @param fromUnit The unit to convert from
 * @param toUnit The unit to convert to
 * @returns The converted weight value
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnit | string,
  toUnit: WeightUnit | string
): number => {
  // Standardize unit strings
  const standardizedFromUnit = standardizeWeightUnit(fromUnit);
  const standardizedToUnit = standardizeWeightUnit(toUnit);
  
  // Get conversion factors
  const fromInfo = weightUnitInfos[standardizedFromUnit];
  const toInfo = weightUnitInfos[standardizedToUnit];
  
  // Convert to grams first (as base unit)
  const grams = weight * fromInfo.conversionToGrams;
  
  // Then convert from grams to target unit
  return grams / toInfo.conversionToGrams;
};

/**
 * Convert weight to grams (base unit for conversions)
 * 
 * @param weight The weight value
 * @param unit The weight unit
 * @returns Weight in grams
 */
export const convertWeightToGrams = (weight: number, unit: WeightUnit | string): number => {
  const standardizedUnit = standardizeWeightUnit(unit);
  const unitInfo = weightUnitInfos[standardizedUnit];
  return weight * unitInfo.conversionToGrams;
};

/**
 * Format weight with appropriate precision for display
 * 
 * @param weight The weight value
 * @param unit The weight unit
 * @returns Formatted weight string
 */
export const formatWeight = (weight: number, unit: WeightUnit | string): string => {
  const standardizedUnit = standardizeWeightUnit(unit);
  const unitInfo = weightUnitInfos[standardizedUnit];
  
  return `${weight.toFixed(unitInfo.decimalPlaces)} ${unitInfo.displayName}`;
};

/**
 * Calculate percentage change between two weights
 * 
 * @param oldWeight The previous weight
 * @param newWeight The new weight
 * @returns Percentage change
 */
export const calculatePercentChange = (oldWeight: number, newWeight: number): number => {
  if (oldWeight === 0) return 0;
  return ((newWeight - oldWeight) / oldWeight) * 100;
};

/**
 * Get the most appropriate unit for displaying a weight value
 * (to avoid tiny numbers like 0.01 kg or huge numbers like 40000 g)
 * 
 * @param weight The weight value
 * @param unit The current weight unit
 * @returns The most appropriate weight unit
 */
export const getAppropriateWeightUnit = (weight: number, unit: WeightUnit): WeightUnit => {
  const weightInGrams = convertWeightToGrams(weight, unit);
  
  if (weightInGrams < 100) {
    return 'g';
  } else if (weightInGrams < 1000) {
    return 'g';
  } else if (weightInGrams < 2000) {
    return 'kg';
  } else {
    return 'lb';
  }
};
