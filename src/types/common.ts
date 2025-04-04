
// Common types for the application

// Status enum
export type Status = 'active' | 'inactive' | 'archived' | 'deleted';

// Weight unit type
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// Weight unit definition
export interface WeightUnitDef {
  code: WeightUnit;
  name: string;
  ratio: number; // Ratio to grams for conversion
}

// Standard weight units
export const weightUnits: WeightUnitDef[] = [
  { code: 'g', name: 'Grams', ratio: 1 },
  { code: 'kg', name: 'Kilograms', ratio: 1000 },
  { code: 'oz', name: 'Ounces', ratio: 28.3495 },
  { code: 'lb', name: 'Pounds', ratio: 453.592 }
];

// Helper function to standardize weight units
export function standardizeWeightUnit(unit: string | null): WeightUnit {
  if (!unit) return 'g';
  
  const normalizedUnit = unit.toLowerCase();
  
  // Handle common variations
  if (normalizedUnit === 'gram' || normalizedUnit === 'grams' || normalizedUnit === 'g') {
    return 'g';
  }
  if (normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms' || normalizedUnit === 'kg') {
    return 'kg';
  }
  if (normalizedUnit === 'ounce' || normalizedUnit === 'ounces' || normalizedUnit === 'oz') {
    return 'oz';
  }
  if (normalizedUnit === 'pound' || normalizedUnit === 'pounds' || normalizedUnit === 'lb' || normalizedUnit === 'lbs') {
    return 'lb';
  }
  
  // Default to grams if unrecognized
  return 'g';
}

// Convert weight between different units
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first
  const fromUnitDef = weightUnits.find(u => u.code === fromUnit);
  const toUnitDef = weightUnits.find(u => u.code === toUnit);
  
  if (!fromUnitDef || !toUnitDef) {
    console.error(`Unknown weight units: ${fromUnit} or ${toUnit}`);
    return weight;
  }
  
  // Convert to grams, then to target unit
  const weightInGrams = weight * fromUnitDef.ratio;
  return weightInGrams / toUnitDef.ratio;
}

// Format weight with unit
export function formatWeight(weight: number, unit: WeightUnit): string {
  return `${weight} ${unit}`;
}
