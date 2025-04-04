
// Common types used across the application

// Weight unit types
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';
export type WeightUnitWithLegacy = WeightUnit | 'lbs'; // For backward compatibility

export const weightUnits: WeightUnit[] = ['lb', 'kg', 'g', 'oz'];

// Standardize weight units (handle legacy 'lbs' -> 'lb')
export const standardizeWeightUnit = (unit: WeightUnitWithLegacy): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  return unit;
};
