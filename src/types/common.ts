
// Weight unit types and utilities

// Basic weight unit type
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

// Extended weight unit type for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'lbs' | 'pounds' | 'kilograms' | 'grams' | 'ounces';

// Weight unit information object
export interface WeightUnitInfo {
  id: WeightUnit;
  name: string;
  fullName: string;
  conversionToGrams: number;
}

// Weight unit option for select inputs
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Weight unit information data
export const weightUnitInfos: WeightUnitInfo[] = [
  { id: 'lb', name: 'lb', fullName: 'Pounds', conversionToGrams: 453.592 },
  { id: 'kg', name: 'kg', fullName: 'Kilograms', conversionToGrams: 1000 },
  { id: 'g', name: 'g', fullName: 'Grams', conversionToGrams: 1 },
  { id: 'oz', name: 'oz', fullName: 'Ounces', conversionToGrams: 28.35 }
];

// Weight unit options for select dropdowns
export const weightUnitOptions: WeightUnitOption[] = weightUnitInfos.map(unit => ({
  value: unit.id,
  label: unit.name
}));

// Helper to standardize weight unit inputs
export const standardizeWeightUnit = (unit?: string): WeightUnit => {
  if (!unit) return 'lb';
  
  const unitLower = unit.toLowerCase();
  
  if (unitLower === 'lbs' || unitLower === 'pounds') return 'lb';
  if (unitLower === 'kilograms') return 'kg';
  if (unitLower === 'grams') return 'g';
  if (unitLower === 'ounces') return 'oz';
  
  // Check if it's already a valid unit
  if (weightUnitInfos.some(info => info.id === unitLower)) {
    return unitLower as WeightUnit;
  }
  
  // Default to pounds if unit is not recognized
  return 'lb';
};

// Helper to get weight unit info
export const getWeightUnitInfo = (unit: WeightUnit): WeightUnitInfo => {
  const info = weightUnitInfos.find(info => info.id === unit);
  return info || weightUnitInfos[0]; // Default to pounds if not found
};

// Helper to get weight unit name
export const getWeightUnitName = (unit: WeightUnit): string => {
  return getWeightUnitInfo(unit).name;
};

// For compatibility with older code
export const weightUnits: WeightUnit[] = ['lb', 'kg', 'g', 'oz'];
