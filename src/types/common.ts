
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

/**
 * Format a weight value with its unit for display
 * @param weight Weight value
 * @param unit Weight unit
 * @returns Formatted string
 */
export const formatWeightWithUnit = (weight: number, unit: WeightUnit): string => {
  const standardUnit = standardizeWeightUnit(unit);
  
  switch (standardUnit) {
    case 'lb':
      return `${weight.toFixed(1)} lb`;
    case 'kg':
      return `${weight.toFixed(1)} kg`;
    case 'oz':
      return `${weight.toFixed(1)} oz`;
    case 'g':
      return `${Math.round(weight)} g`;
    default:
      return `${weight.toFixed(1)} ${unit}`;
  }
};

/**
 * Get the full name of a weight unit
 * @param unit Weight unit abbreviation
 * @returns Full name of the unit
 */
export const getWeightUnitName = (unit: WeightUnit): string => {
  const standardUnit = standardizeWeightUnit(unit);
  
  switch (standardUnit) {
    case 'lb':
      return 'pounds';
    case 'kg':
      return 'kilograms';
    case 'oz':
      return 'ounces';
    case 'g':
      return 'grams';
    default:
      return unit;
  }
};
