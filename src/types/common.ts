
// Common types used across the application

// Weight unit types
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';
export type WeightUnitWithLegacy = WeightUnit | 'lbs'; // For backward compatibility

// Add name and code for UI display purposes
export interface WeightUnitOption {
  code: WeightUnit;
  name: string;
}

export const weightUnits: WeightUnitOption[] = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'g', name: 'Grams' },
  { code: 'oz', name: 'Ounces' }
];

// Standardize weight units (handle legacy 'lbs' -> 'lb')
export const standardizeWeightUnit = (unit: WeightUnitWithLegacy): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  return unit as WeightUnit;
};
