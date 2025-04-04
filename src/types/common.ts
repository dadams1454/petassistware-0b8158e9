
// Common type definitions used across the application

export type Gender = 'male' | 'female';

// Weight units with proper export
export type WeightUnit = 'g' | 'kg' | 'lb' | 'oz';

// For backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'grams' | 'kilograms' | 'pounds' | 'ounces';

// Standard unit conversion function
export const standardizeWeightUnit = (unit: WeightUnitWithLegacy): WeightUnit => {
  switch (unit) {
    case 'grams': return 'g';
    case 'kilograms': return 'kg';
    case 'pounds': return 'lb';
    case 'ounces': return 'oz';
    default: return unit as WeightUnit;
  }
};

// Common weight units for UI dropdowns
export const weightUnits: WeightUnit[] = ['g', 'kg', 'lb', 'oz'];
