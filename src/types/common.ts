
// Common type definitions used across the app

// Weight units
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

// For backward compatibility with older code that might use strings
export type WeightUnitWithLegacy = WeightUnit | string;

// Standardize weight unit function
export const standardizeWeightUnit = (unit?: string): WeightUnit => {
  if (!unit) return 'lb'; // Default to pounds
  
  const lowerUnit = unit.toLowerCase();
  if (lowerUnit === 'lb' || lowerUnit === 'lbs' || lowerUnit === 'pound' || lowerUnit === 'pounds') {
    return 'lb';
  } else if (lowerUnit === 'kg' || lowerUnit === 'kgs' || lowerUnit === 'kilogram' || lowerUnit === 'kilograms') {
    return 'kg';
  } else if (lowerUnit === 'g' || lowerUnit === 'grams' || lowerUnit === 'gram') {
    return 'g';
  } else if (lowerUnit === 'oz' || lowerUnit === 'ounce' || lowerUnit === 'ounces') {
    return 'oz';
  }
  
  return 'lb'; // Default fallback
};

// Weight unit info structure
export interface WeightUnitInfo {
  unit: WeightUnit;
  name: string;
  shortName: string;
  conversionToLb: number;
  decimals: number;
}

// Weight unit option for dropdowns
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Weight unit information array
export const weightUnitInfos: WeightUnitInfo[] = [
  { 
    unit: 'lb', 
    name: 'Pounds', 
    shortName: 'lb', 
    conversionToLb: 1, 
    decimals: 1 
  },
  { 
    unit: 'kg', 
    name: 'Kilograms', 
    shortName: 'kg', 
    conversionToLb: 2.20462, 
    decimals: 2 
  },
  { 
    unit: 'g', 
    name: 'Grams', 
    shortName: 'g', 
    conversionToLb: 0.00220462, 
    decimals: 0 
  },
  { 
    unit: 'oz', 
    name: 'Ounces', 
    shortName: 'oz', 
    conversionToLb: 0.0625, 
    decimals: 1 
  }
];

// Weight unit options for select dropdowns
export const weightUnitOptions: WeightUnitOption[] = weightUnitInfos.map(info => ({
  value: info.unit,
  label: info.name
}));

// Get weight unit info by unit
export const getWeightUnitInfo = (unit: WeightUnit): WeightUnitInfo => {
  const info = weightUnitInfos.find(info => info.unit === unit);
  return info || weightUnitInfos[0]; // Default to pounds if not found
};

// Get weight unit name
export const getWeightUnitName = (unit: WeightUnit): string => {
  return getWeightUnitInfo(unit).name;
};

// Simple array of weight units for backward compatibility
export const weightUnits: WeightUnit[] = ['lb', 'kg', 'g', 'oz'];
