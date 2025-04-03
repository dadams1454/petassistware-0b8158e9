
// Weight unit type definitions
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';

// Legacy type for backwards compatibility
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// Array of available weight units
export const weightUnits: { code: WeightUnit; name: string }[] = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'g', name: 'Grams' },
  { code: 'oz', name: 'Ounces' }
];

// Helper function to standardize weight unit
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
