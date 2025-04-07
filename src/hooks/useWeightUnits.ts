
import { WeightUnit, weightUnitInfos } from '@/types/weight-units';
import { convertWeightToGrams, convertWeight, formatWeight } from '@/utils/weightConversion';

export const useWeightUnits = () => {
  /**
   * Convert a weight value from one unit to another
   */
  const convert = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
    return convertWeight(weight, fromUnit, toUnit);
  };

  /**
   * Convert a weight value to grams
   */
  const toGrams = (weight: number, unit: WeightUnit): number => {
    return convertWeightToGrams(weight, unit);
  };

  /**
   * Format a weight value with its unit for display
   */
  const format = (weight: number, unit: WeightUnit): string => {
    return formatWeight(weight, unit);
  };

  return {
    weightUnitInfos,
    convert,
    toGrams,
    format
  };
};
