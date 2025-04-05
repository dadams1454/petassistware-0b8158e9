
import { type WeightUnit, type WeightUnitInfo } from '@/types/common';

/**
 * Calculate percent change between two weight values
 */
export const calculatePercentChange = (
  oldWeight: number, 
  newWeight: number
): number => {
  // Calculate percentage change
  return ((newWeight - oldWeight) / oldWeight) * 100;
};

/**
 * Convert weight between different units
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

// Export the weight units array for UI components
export const weightUnits: WeightUnitInfo[] = [
  { id: 'lb', name: 'Pounds', abbreviation: 'lb', conversionToG: 453.592 },
  { id: 'kg', name: 'Kilograms', abbreviation: 'kg', conversionToG: 1000 },
  { id: 'oz', name: 'Ounces', abbreviation: 'oz', conversionToG: 28.3495 },
  { id: 'g', name: 'Grams', abbreviation: 'g', conversionToG: 1 }
];
