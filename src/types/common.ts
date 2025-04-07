
// Define common types used across the application

// Weight units for consistent use throughout the app
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit with display information
export interface WeightUnitInfo {
  id: WeightUnit;
  label: string;
  abbr: string;
  conversionToG: number;
  name?: string; // For backward compatibility with some components
}

// Weight unit option (for UI dropdowns)
export interface WeightUnitOption {
  value: WeightUnit;
  label: string;
}

// Weight units with display information
export const weightUnits: WeightUnitInfo[] = [
  { id: 'oz', label: 'Ounces', abbr: 'oz', conversionToG: 28.3495, name: 'Ounces' },
  { id: 'g', label: 'Grams', abbr: 'g', conversionToG: 1, name: 'Grams' },
  { id: 'lb', label: 'Pounds', abbr: 'lb', conversionToG: 453.592, name: 'Pounds' },
  { id: 'kg', label: 'Kilograms', abbr: 'kg', conversionToG: 1000, name: 'Kilograms' }
];

// Weight unit options for dropdowns
export const weightUnitOptions: WeightUnitOption[] = weightUnits.map(unit => ({
  value: unit.id,
  label: unit.label
}));

// For easy access in components
export const weightUnitInfos = weightUnits;

// Common date format
export type DateFormat = 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'yyyy-MM-dd';

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'archived';

// Common currency types
export type Currency = 'USD' | 'CAD' | 'EUR' | 'GBP';

// Common frequency types for medications, feedings, etc.
export const FrequencyTypes = {
  ONCE: 'once',
  DAILY: 'daily',
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as_needed'
};

// Standardize weight unit (handles variations like 'lbs')
export function standardizeWeightUnit(unit: string): WeightUnit {
  if (!unit) return 'lb'; // Default to pounds if not provided
  
  const normalizedUnit = unit.toLowerCase().trim();
  
  if (normalizedUnit === 'lbs' || normalizedUnit === 'pound' || normalizedUnit === 'pounds') {
    return 'lb';
  }
  if (normalizedUnit === 'oz' || normalizedUnit === 'ounce' || normalizedUnit === 'ounces') {
    return 'oz';
  }
  if (normalizedUnit === 'kg' || normalizedUnit === 'kilo' || normalizedUnit === 'kilos' || normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms') {
    return 'kg';
  }
  if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams') {
    return 'g';
  }
  
  // If no match, check if it's already a valid unit
  if (['oz', 'g', 'lb', 'kg'].includes(normalizedUnit)) {
    return normalizedUnit as WeightUnit;
  }
  
  // Default to pounds if not recognized
  return 'lb';
}

// Get weight unit info by unit
export function getWeightUnitInfo(unit: WeightUnit): WeightUnitInfo {
  const found = weightUnits.find(u => u.id === unit);
  return found || weightUnits[2]; // Default to pounds if not found
}

// Get weight unit name
export function getWeightUnitName(unit: WeightUnit): string {
  const info = getWeightUnitInfo(unit);
  return info.label;
}

// Health related enums
export { AppetiteLevelEnum, EnergyLevelEnum, StoolConsistencyEnum } from './health';
