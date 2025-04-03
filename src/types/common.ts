
// Common types used across multiple modules

// Weight unit type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

export type WeightUnitWithLegacy = WeightUnit | 'lbs'; // For backward compatibility

// Interface for weight unit display
export interface WeightUnitOption {
  code: WeightUnit;
  name: string;
}

// Utility function to standardize weight units (handle legacy formats)
export const standardizeWeightUnit = (unit?: string | null): WeightUnit => {
  if (!unit) return 'lb'; // Default to lb
  
  // Handle legacy 'lbs' format
  if (unit === 'lbs') return 'lb';
  
  // Check if it's a valid weight unit
  if (['oz', 'g', 'lb', 'kg'].includes(unit)) {
    return unit as WeightUnit;
  }
  
  // Default to lb for unknown units
  return 'lb';
};

// Weight units for UI selection
export const weightUnits: WeightUnitOption[] = [
  { code: 'lb', name: 'Pounds' },
  { code: 'kg', name: 'Kilograms' },
  { code: 'oz', name: 'Ounces' },
  { code: 'g', name: 'Grams' }
];

// Format weight with unit for display
export const formatWeightWithUnit = (
  weight: number | string | null | undefined, 
  unit: WeightUnit | string | null | undefined
): string => {
  if (weight === null || weight === undefined) return 'N/A';
  
  const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight;
  const standardUnit = standardizeWeightUnit(unit);
  
  return `${numWeight.toFixed(2)} ${standardUnit}`;
};

// Get the display name for a weight unit
export const getWeightUnitName = (unit: WeightUnit | string | null | undefined): string => {
  const standardUnit = standardizeWeightUnit(unit);
  const unitObj = weightUnits.find(u => u.code === standardUnit);
  return unitObj ? unitObj.name : 'Pounds';
};
