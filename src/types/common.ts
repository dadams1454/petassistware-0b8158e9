
// Common types shared across the application

export type WeightUnitWithLegacy = 'lb' | 'kg' | 'g' | 'oz' | 'lbs';
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

// Function to convert legacy weight units to standardized ones
export const standardizeWeightUnit = (unit: WeightUnitWithLegacy): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  return unit as WeightUnit;
};

// Weight units array for UI components
export const weightUnits = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'g', name: 'Grams' }
];
