
// Weight unit types
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// For components that need to display weight unit options
export const weightUnits: { value: WeightUnit; label: string }[] = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'oz', label: 'Ounces (oz)' }
];

// Standardize weight units for consistency
export function standardizeWeightUnit(unit: WeightUnitWithLegacy): WeightUnit {
  if (unit === 'lbs') return 'lb';
  return unit as WeightUnit;
}

// For UI status colors
export type StatusColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
