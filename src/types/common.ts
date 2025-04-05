
// Define the basic weight unit type
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';

// Information about each weight unit for display and conversion
export interface WeightUnitInfo {
  id: WeightUnit;
  name: string;
  abbreviation: string;
  conversionToG: number;
}

export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Available weight units with their conversion rates to grams
export const weightUnits: WeightUnitInfo[] = [
  { id: 'g', name: 'Grams', abbreviation: 'g', conversionToG: 1 },
  { id: 'oz', name: 'Ounces', abbreviation: 'oz', conversionToG: 28.3495 },
  { id: 'lb', name: 'Pounds', abbreviation: 'lb', conversionToG: 453.592 },
  { id: 'kg', name: 'Kilograms', abbreviation: 'kg', conversionToG: 1000 }
];

// Weight unit options for select inputs
export const weightUnitOptions: WeightUnitOption[] = weightUnits.map(unit => ({
  value: unit.id,
  label: unit.name
}));

// Get information about a weight unit
export const getWeightUnitInfo = (unit: WeightUnit | string): WeightUnitInfo => {
  const standardUnit = standardizeWeightUnit(unit as string);
  return weightUnits.find(u => u.id === standardUnit) || weightUnits[0];
};

// Get the display name for a weight unit
export const getWeightUnitName = (unit: WeightUnit | string): string => {
  return getWeightUnitInfo(unit).name;
};

// Standardize weight unit strings (handle legacy 'lbs' vs 'lb')
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  return unit as WeightUnit;
};

// Weight unit information for use in UI
export const weightUnitInfos: Record<WeightUnit, WeightUnitInfo> = {
  g: { id: 'g', name: 'Grams', abbreviation: 'g', conversionToG: 1 },
  oz: { id: 'oz', name: 'Ounces', abbreviation: 'oz', conversionToG: 28.3495 },
  lb: { id: 'lb', name: 'Pounds', abbreviation: 'lb', conversionToG: 453.592 },
  kg: { id: 'kg', name: 'Kilograms', abbreviation: 'kg', conversionToG: 1000 }
};
