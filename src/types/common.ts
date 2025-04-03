
// Common types used throughout the application

export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

export type WeightUnitWithLegacy = WeightUnit | string;

export const weightUnits = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'g', name: 'Grams' },
  { code: 'oz', name: 'Ounces' }
];

export function standardizeWeightUnit(unit: string): WeightUnit {
  switch (unit.toLowerCase()) {
    case 'lb':
    case 'lbs':
    case 'pound':
    case 'pounds':
      return 'lb';
    case 'kg':
    case 'kilo':
    case 'kilos':
    case 'kilogram':
    case 'kilograms':
      return 'kg';
    case 'g':
    case 'gram':
    case 'grams':
      return 'g';
    case 'oz':
    case 'ounce':
    case 'ounces':
      return 'oz';
    default:
      return 'lb'; // Default to pounds
  }
}
