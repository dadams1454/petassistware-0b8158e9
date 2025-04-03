
// Weight unit definitions
export type WeightUnit = 'kg' | 'lb' | 'g' | 'oz';
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// Standard weight units for use in forms
export const weightUnits = [
  { code: 'kg', name: 'Kilograms (kg)' },
  { code: 'lb', name: 'Pounds (lb)' },
  { code: 'g', name: 'Grams (g)' },
  { code: 'oz', name: 'Ounces (oz)' }
];

// Function to standardize weight unit names
export const standardizeWeightUnit = (unit: WeightUnitWithLegacy): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  return unit as WeightUnit;
};
