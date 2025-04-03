
// Common type definitions used across the application

// Weight unit types - standardized across the application
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';
export type WeightUnitWithLegacy = WeightUnit | 'lbs'; // For backward compatibility 

// Helper to standardize weight units
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  switch (unit?.toLowerCase()) {
    case 'lb':
    case 'lbs':
    case 'pound':
    case 'pounds':
      return 'lb';
    case 'kg':
    case 'kgs':
    case 'kilogram':
    case 'kilograms':
      return 'kg';
    case 'oz':
    case 'ozs':
    case 'ounce':
    case 'ounces':
      return 'oz';
    case 'g':
    case 'gs':
    case 'gram':
    case 'grams':
      return 'g';
    default:
      return 'lb'; // Default to lb
  }
};

// Weight units for display in UI
export const weightUnits = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' }
];
