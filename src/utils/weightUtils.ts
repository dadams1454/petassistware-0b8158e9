
import { WeightUnit } from '@/types/common';

// Convert weight from one unit to another
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return weight;
  
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
    case 'lbs':
      weightInGrams = weight * 453.592;
      break;
    default:
      return weight;
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
    case 'lbs':
      return weightInGrams / 453.592;
    default:
      return weight;
  }
}

// Format weight with appropriate unit
export function formatWeight(weight: number, unit: WeightUnit): string {
  let formatted = '';
  switch (unit) {
    case 'kg':
      formatted = `${weight.toFixed(2)} kg`;
      break;
    case 'g':
      formatted = `${Math.round(weight)} g`;
      break;
    case 'oz':
      formatted = `${weight.toFixed(1)} oz`;
      break;
    case 'lb':
    case 'lbs':
      formatted = `${weight.toFixed(2)} lb`;
      break;
    default:
      formatted = `${weight.toFixed(2)} ${unit}`;
  }
  return formatted;
}

// Standardize weight unit to ensure consistent usage
export function standardizeUnit(unit: string): WeightUnit {
  switch (unit.toLowerCase()) {
    case 'kg':
    case 'kilograms':
      return 'kg';
    case 'g':
    case 'grams':
      return 'g';
    case 'oz':
    case 'ounces':
      return 'oz';
    case 'lb':
    case 'lbs':
    case 'pounds':
      return 'lb';
    default:
      return 'lb'; // Default to pounds
  }
}

// Get display name for unit
export function getUnitDisplayName(unit: WeightUnit): string {
  switch (unit) {
    case 'kg': return 'Kilograms';
    case 'g': return 'Grams';
    case 'oz': return 'Ounces';
    case 'lb': return 'Pounds';
    case 'lbs': return 'Pounds';
    default: return unit;
  }
}

// Weight unit options for select inputs
export const weightUnitOptions = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' }
];
