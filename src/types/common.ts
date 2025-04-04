
// Common type definitions used across the application

export type Gender = 'Male' | 'Female';

// Weight unit types - both legacy and new formats for compatibility
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// Extended weight unit type with display information
export interface WeightUnitWithDisplay {
  code: string;
  name: string;
}

// For compatibility with code expecting the object format
export type WeightUnitWithLegacy = WeightUnit | WeightUnitWithDisplay;

// Weight units for display
export const weightUnits: WeightUnitWithDisplay[] = [
  { code: 'g', name: 'Grams' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'lb', name: 'Pounds' }
];

// Helper function to standardize weight unit values
export function standardizeWeightUnit(unit: WeightUnitWithLegacy): WeightUnit {
  if (typeof unit === 'string') {
    return unit as WeightUnit;
  }
  return unit.code as WeightUnit;
}
