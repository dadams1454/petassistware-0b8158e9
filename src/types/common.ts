
// Define weight unit types and utilities

// Standard weight units
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// For backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'gram' | 'kilogram' | 'ounce' | 'pound';

// Information about each weight unit for display
export interface WeightUnitInfo {
  name: string;
  shortName: string;
  conversionToGrams: number;
}

// Weight unit option for select dropdowns
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Map of weight unit info
export const weightUnitInfos: Record<WeightUnit, WeightUnitInfo> = {
  g: { name: 'Grams', shortName: 'g', conversionToGrams: 1 },
  kg: { name: 'Kilograms', shortName: 'kg', conversionToGrams: 1000 },
  oz: { name: 'Ounces', shortName: 'oz', conversionToGrams: 28.3495 },
  lb: { name: 'Pounds', shortName: 'lb', conversionToGrams: 453.592 }
};

// Weight unit options for select elements
export const weightUnitOptions: WeightUnitOption[] = Object.entries(weightUnitInfos)
  .map(([value, info]) => ({
    value: value as WeightUnit,
    label: info.name
  }));

// Helper to get weight unit info
export function getWeightUnitInfo(unit: WeightUnit): WeightUnitInfo {
  return weightUnitInfos[unit] || weightUnitInfos.lb;
}

// Helper to get weight unit name
export function getWeightUnitName(unit: WeightUnit): string {
  return getWeightUnitInfo(unit).name;
}

// Standardize weight unit from legacy formats
export function standardizeWeightUnit(unit?: string): WeightUnit {
  if (!unit) return 'lb';
  
  const lowerUnit = unit.toLowerCase();
  
  switch (lowerUnit) {
    case 'g':
    case 'gram':
    case 'grams':
      return 'g';
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return 'kg';
    case 'oz':
    case 'ounce':
    case 'ounces':
      return 'oz';
    case 'lb':
    case 'pound':
    case 'pounds':
      return 'lb';
    default:
      return 'lb';
  }
}

// List of all weight units for quick access
export const weightUnits: WeightUnit[] = ['g', 'kg', 'oz', 'lb'];
