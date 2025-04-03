
/**
 * Weight unit types for consistent use across the application
 */
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';

// For backward compatibility with code still using legacy enum pattern
export type WeightUnitWithLegacy = WeightUnit | 'LB' | 'KG' | 'OZ' | 'G';

/**
 * Weight unit standardization function
 * Converts legacy uppercase units to standardized lowercase
 */
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const unitMap: Record<string, WeightUnit> = {
    'lb': 'lb',
    'kg': 'kg', 
    'oz': 'oz',
    'g': 'g',
    'LB': 'lb',
    'KG': 'kg',
    'OZ': 'oz',
    'G': 'g',
    'pound': 'lb',
    'pounds': 'lb',
    'kilogram': 'kg',
    'kilograms': 'kg',
    'ounce': 'oz',
    'ounces': 'oz',
    'gram': 'g',
    'grams': 'g'
  };

  return unitMap[unit] || 'lb';
};

/**
 * Format weight with appropriate unit
 */
export const formatWeightWithUnit = (weight: number, unit: WeightUnit): string => {
  if (typeof weight !== 'number' || isNaN(weight)) {
    return 'N/A';
  }

  // Format the weight based on unit
  const formattedWeight = weight.toFixed(
    unit === 'g' || unit === 'oz' ? 0 : 1
  );

  return `${formattedWeight} ${unit}`;
};

/**
 * Get the display name for a weight unit
 */
export const getWeightUnitName = (unit: WeightUnit): string => {
  const unitNames: Record<WeightUnit, string> = {
    'lb': 'pounds',
    'kg': 'kilograms',
    'oz': 'ounces',
    'g': 'grams'
  };
  
  return unitNames[unit] || unit;
};

// Available weight units for UI dropdowns
export const weightUnits = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' }
];
