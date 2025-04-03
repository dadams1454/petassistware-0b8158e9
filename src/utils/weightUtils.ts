
import { WeightUnit } from '@/types/common';

/**
 * Format a weight value with its unit for display
 */
export const formatWeight = (weight: number, unit: WeightUnit): string => {
  if (isNaN(weight)) return '0';
  
  const roundedWeight = Math.round(weight * 100) / 100;
  return `${roundedWeight} ${unit}`;
};

/**
 * Convert weight between different units
 */
export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
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
      weightInGrams = weight * 453.59237;
      break;
    default:
      weightInGrams = weight;
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
      return weightInGrams / 453.59237;
    default:
      return weight;
  }
};

/**
 * Get weight unit display name 
 */
export const getWeightUnitDisplay = (unit: WeightUnit): string => {
  switch (unit) {
    case 'lb':
      return 'pounds';
    case 'kg':
      return 'kilograms';
    case 'g':
      return 'grams';
    case 'oz':
      return 'ounces';
    default:
      return unit;
  }
};

/**
 * Calculate the percentage change between two weights
 */
export const calculatePercentChange = (
  oldWeight: number, 
  newWeight: number, 
  oldUnit: WeightUnit, 
  newUnit: WeightUnit
): number => {
  if (oldWeight <= 0) return 0;
  
  // Convert to same unit if needed
  const normalizedOldWeight = 
    oldUnit !== newUnit ? convertWeight(oldWeight, oldUnit, newUnit) : oldWeight;
  
  // Calculate percentage change
  return ((newWeight - normalizedOldWeight) / normalizedOldWeight) * 100;
};

/**
 * Get the appropriate weight unit based on age and species
 */
export const getDefaultWeightUnit = (
  ageDays: number, 
  species: 'dog' | 'cat' = 'dog'
): WeightUnit => {
  if (species === 'cat') {
    // Cats typically measured in lb or kg regardless of age
    return 'lb';
  }
  
  // For dogs, use oz or g for very young puppies, otherwise lb or kg
  if (ageDays < 21) {
    return 'oz';
  }
  
  return 'lb';
};
