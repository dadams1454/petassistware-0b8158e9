
// Common types used across the application

// Weight units
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// Legacy compatibility for code that might use 'lbs'
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// Select option
export interface SelectOption {
  value: string;
  label: string;
}

// Weight units array for UI components
export const weightUnits = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'g', name: 'Grams' }
];

// Standardize weight unit
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  if (unit && ['g', 'kg', 'oz', 'lb'].includes(unit)) {
    return unit as WeightUnit;
  }
  return 'lb'; // Default fallback
};
