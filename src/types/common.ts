
// WeightUnit type definition
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// Weight unit information interface
export interface WeightUnitInfo {
  id: WeightUnit;
  name: string;
  displayName: string;
  conversionToG: number;
}

// Weight unit option for UI
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Standardize weight unit
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  switch (unit.toLowerCase()) {
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
    case 'lbs':
    case 'pound':
    case 'pounds':
      return 'lb';
    default:
      return 'lb'; // Default unit
  }
};

// Weight unit information
export const weightUnits: WeightUnitInfo[] = [
  { id: 'g', name: 'grams', displayName: 'Grams (g)', conversionToG: 1 },
  { id: 'kg', name: 'kilograms', displayName: 'Kilograms (kg)', conversionToG: 1000 },
  { id: 'oz', name: 'ounces', displayName: 'Ounces (oz)', conversionToG: 28.3495 },
  { id: 'lb', name: 'pounds', displayName: 'Pounds (lb)', conversionToG: 453.592 }
];

// Weight unit options for dropdowns
export const weightUnitOptions: WeightUnitOption[] = weightUnits.map(unit => ({
  value: unit.id,
  label: unit.displayName
}));

// Get weight unit information
export const weightUnitInfos: Record<WeightUnit, WeightUnitInfo> = weightUnits.reduce(
  (acc, unit) => ({ ...acc, [unit.id]: unit }),
  {} as Record<WeightUnit, WeightUnitInfo>
);

// Get weight unit information by ID
export const getWeightUnitInfo = (unit: WeightUnit): WeightUnitInfo => {
  return weightUnitInfos[unit] || weightUnitInfos['lb'];
};

// Get weight unit name
export const getWeightUnitName = (unit: WeightUnit): string => {
  return getWeightUnitInfo(unit).name;
};
