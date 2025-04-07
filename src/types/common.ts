
/**
 * Common types used throughout the application
 */

// Weight unit type definition
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit information structure
export interface WeightUnitInfo {
  unit: WeightUnit;
  label: string;
  conversionToGrams: number;
  displayPrecision: number;
}

// Weight unit option for UI selects
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Frequency types for medications and other scheduled events
export enum FrequencyTypes {
  DAILY = 'daily',
  TWICE_DAILY = 'twice daily',
  THREE_TIMES_DAILY = 'three times daily',
  EVERY_OTHER_DAY = 'every other day',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  AS_NEEDED = 'as needed',
  ONCE_DAILY = 'once daily'
}

// Weight unit information
export const weightUnitInfos: WeightUnitInfo[] = [
  { unit: 'g', label: 'Grams', conversionToGrams: 1, displayPrecision: 0 },
  { unit: 'oz', label: 'Ounces', conversionToGrams: 28.3495, displayPrecision: 1 },
  { unit: 'lb', label: 'Pounds', conversionToGrams: 453.592, displayPrecision: 1 },
  { unit: 'kg', label: 'Kilograms', conversionToGrams: 1000, displayPrecision: 1 }
];

// Helper function to get weight unit info
export const getWeightUnitInfo = (unit: WeightUnit): WeightUnitInfo => {
  const info = weightUnitInfos.find(info => info.unit === unit);
  return info || weightUnitInfos[0];
};

// Helper function to get weight unit name
export const getWeightUnitName = (unit: WeightUnit): string => {
  return getWeightUnitInfo(unit).label;
};

// Weight unit options for select inputs
export const weightUnitOptions: WeightUnitOption[] = weightUnitInfos.map(info => ({
  value: info.unit,
  label: info.label
}));

// Weight units array for validation
export const weightUnits: WeightUnit[] = ['g', 'oz', 'lb', 'kg'];

// Function to standardize weight unit to enum value
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const normalizedUnit = unit?.toLowerCase?.() || '';
  
  switch (normalizedUnit) {
    case 'gram':
    case 'grams':
    case 'g':
      return 'g';
    case 'ounce':
    case 'ounces':
    case 'oz':
      return 'oz';
    case 'pound':
    case 'pounds':
    case 'lb':
    case 'lbs':
      return 'lb';
    case 'kilogram':
    case 'kilograms':
    case 'kg':
    case 'kgs':
      return 'kg';
    default:
      return 'lb'; // Default to pounds
  }
};
