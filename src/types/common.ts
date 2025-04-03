
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';
export type WeightUnitWithLegacy = WeightUnit | 'lbs'; // For backward compatibility

// Standard weight units with display names and conversion factors
export const weightUnits: { code: WeightUnit; name: string; factor: number }[] = [
  { code: 'lb', name: 'Pounds', factor: 453.59237 },
  { code: 'kg', name: 'Kilograms', factor: 1000 },
  { code: 'oz', name: 'Ounces', factor: 28.3495 },
  { code: 'g', name: 'Grams', factor: 1 }
];

// Utility function to get a user-friendly name for a weight unit
export const getWeightUnitName = (unit: WeightUnit | string): string => {
  const foundUnit = weightUnits.find(u => u.code === unit);
  return foundUnit ? foundUnit.name : unit;
};

// Standardize weight unit codes (handles legacy 'lbs' -> 'lb')
export const standardizeWeightUnit = (unit: string | undefined): WeightUnit => {
  if (!unit) return 'lb';
  
  // Handle the common 'lbs' -> 'lb' conversion
  if (unit === 'lbs') return 'lb';
  
  // Ensure we have a valid weight unit
  if (weightUnits.some(u => u.code === unit)) {
    return unit as WeightUnit;
  }
  
  // Default to 'lb' if not recognized
  return 'lb';
};

// Utility to format weight values with their units
export const formatWeightWithUnit = (
  weight: number | string | null | undefined, 
  unit: WeightUnit | string | null | undefined,
  decimalPlaces: number = 2
): string => {
  if (weight === null || weight === undefined) return 'N/A';
  
  const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight;
  
  if (isNaN(numWeight)) return 'N/A';
  
  const standardUnit = standardizeWeightUnit(unit as string);
  return `${numWeight.toFixed(decimalPlaces)} ${standardUnit}`;
};
