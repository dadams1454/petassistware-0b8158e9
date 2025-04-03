
// Common type definitions used across the application

// Weight units supported by the application
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

// Standard weight unit options for select inputs
export const weightUnits = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'g', name: 'Grams' },
  { code: 'oz', name: 'Ounces' }
];

// Helper to standardize weight unit
export function standardizeWeightUnit(unit: string): WeightUnit {
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
