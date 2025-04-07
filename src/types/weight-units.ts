
// Define weight units as a union type for better type safety
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Legacy enum for backward compatibility
export enum WeightUnitEnum {
  OZ = 'oz',
  G = 'g',
  LB = 'lb',
  KG = 'kg'
}

// Information about each weight unit
export interface WeightUnitInfo {
  unit: WeightUnit;
  label: string;
  toGrams: number; // Conversion factor to grams
  precision: number; // Decimal precision for display
  thresholds?: {
    min: number; // Minimum weight in grams to use this unit
    max: number; // Maximum weight in grams to use this unit
  };
}

// Weight unit information array
export const weightUnitInfos: WeightUnitInfo[] = [
  { 
    unit: 'oz', 
    label: 'oz', 
    toGrams: 28.3495, 
    precision: 1,
    thresholds: { min: 0, max: 1000 } 
  },
  { 
    unit: 'g', 
    label: 'g', 
    toGrams: 1, 
    precision: 0,
    thresholds: { min: 0, max: 1000 } 
  },
  { 
    unit: 'lb', 
    label: 'lb', 
    toGrams: 453.592, 
    precision: 2,
    thresholds: { min: 1000, max: 10000 } 
  },
  { 
    unit: 'kg', 
    label: 'kg', 
    toGrams: 1000, 
    precision: 2,
    thresholds: { min: 1000, max: Infinity } 
  }
];

// Helper function to standardize weight unit values
export function standardizeWeightUnit(unit: string): WeightUnit {
  const normalizedUnit = unit.toLowerCase().trim();
  
  // Check if it's a valid weight unit
  if (normalizedUnit === 'oz' || 
      normalizedUnit === 'g' || 
      normalizedUnit === 'lb' || 
      normalizedUnit === 'kg') {
    return normalizedUnit as WeightUnit;
  }
  
  // Map common variations
  if (normalizedUnit === 'ounce' || normalizedUnit === 'ounces') return 'oz';
  if (normalizedUnit === 'gram' || normalizedUnit === 'grams') return 'g';
  if (normalizedUnit === 'pound' || normalizedUnit === 'pounds') return 'lb';
  if (normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms') return 'kg';
  
  // Default to oz if unknown
  console.warn(`Unknown weight unit: ${unit}, defaulting to oz`);
  return 'oz';
}
