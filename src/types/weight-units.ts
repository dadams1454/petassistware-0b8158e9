
/**
 * Weight units and conversion utilities
 */

// Define the WeightUnit as a union type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit information - kept for backward compatibility
export const weightUnits = [
  { id: 'oz', name: 'Ounces', conversionToG: 28.3495 },
  { id: 'g', name: 'Grams', conversionToG: 1 },
  { id: 'lb', name: 'Pounds', conversionToG: 453.592 },
  { id: 'kg', name: 'Kilograms', conversionToG: 1000 }
];

// Renamed to weightUnitInfos for clarity and consistency
export const weightUnitInfos = weightUnits;

// Function to normalize a weight unit value
export function normalizeWeightUnit(unit: string | WeightUnit): WeightUnit {
  if (!unit) return 'oz';
  
  const normalizedUnit = unit.toLowerCase() as WeightUnit;
  
  if (['oz', 'g', 'lb', 'kg'].includes(normalizedUnit)) {
    return normalizedUnit as WeightUnit;
  }
  
  return 'oz'; // Default to ounces
}

// Convert weight from one unit to another
export function convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  // Convert to grams first as an intermediate step
  const fromUnitInfo = weightUnits.find(u => u.id === fromUnit);
  const toUnitInfo = weightUnits.find(u => u.id === toUnit);
  
  if (!fromUnitInfo || !toUnitInfo) {
    console.error(`Conversion failed: Unknown units - from ${fromUnit} to ${toUnit}`);
    return weight;
  }
  
  // Calculate the weight in grams
  const weightInGrams = weight * fromUnitInfo.conversionToG;
  
  // Convert from grams to the target unit
  return weightInGrams / toUnitInfo.conversionToG;
}

// Standardize a weight unit input
export function standardizeWeightUnit(unit: string): WeightUnit {
  return normalizeWeightUnit(unit);
}
