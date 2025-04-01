
import { WeightUnit } from '@/types/puppyTracking';

// Weight unit conversion factors to grams
const CONVERSION_TO_GRAMS = {
  oz: 28.3495,   // 1 oz = 28.3495g
  g: 1,          // 1g = 1g
  lbs: 453.592,  // 1 lb = 453.592g
  kg: 1000       // 1 kg = 1000g
};

// List of weight units for selection
export const weightUnits = [
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'kg', label: 'Kilograms (kg)' }
];

// Convert weight between units
export const convertWeight = (
  weight: number, 
  fromUnit: WeightUnit, 
  toUnit: WeightUnit
): number => {
  // If the units are the same, no conversion needed
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first
  const grams = weight * CONVERSION_TO_GRAMS[fromUnit];
  
  // Then convert from grams to target unit
  return grams / CONVERSION_TO_GRAMS[toUnit];
};

// Format weight with unit
export const formatWeightWithUnit = (
  weight: number,
  unit: WeightUnit
): string => {
  // Format with proper decimal places based on unit
  let formattedWeight: string;
  
  switch (unit) {
    case 'oz':
    case 'lbs':
      formattedWeight = weight.toFixed(1);
      break;
    case 'g':
      formattedWeight = Math.round(weight).toString();
      break;
    case 'kg':
      formattedWeight = weight.toFixed(2);
      break;
    default:
      formattedWeight = weight.toString();
  }
  
  return `${formattedWeight} ${unit}`;
};

// Calculate percent change between two weight values
export const calculatePercentChange = (
  currentWeight: number,
  previousWeight: number
): number => {
  if (previousWeight === 0) return 0;
  
  return ((currentWeight - previousWeight) / previousWeight) * 100;
};
