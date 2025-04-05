
// Define common types used across the application

// Weight unit type definition - using string literal union type
export type WeightUnit = 'g' | 'oz' | 'lb' | 'kg';

// Legacy weight unit for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// WeightUnit information for display and selection
export interface WeightUnitInfo {
  code: WeightUnit;
  name: string;
}

// For backwards compatibility
export interface WeightUnitOption {
  label: string;  // For Select components
  value: WeightUnit;  // For Select components
}

// Convert WeightUnit to WeightUnitOption for UI display
export const weightUnitOptions: Record<WeightUnit, WeightUnitOption> = {
  'g': { value: 'g', label: 'Grams' },
  'oz': { value: 'oz', label: 'Ounces' },
  'lb': { value: 'lb', label: 'Pounds' },
  'kg': { value: 'kg', label: 'Kilograms' }
};

// Define weight units with full information
export const weightUnitInfos: Record<WeightUnit, WeightUnitInfo> = {
  'g': { code: 'g', name: 'Grams' },
  'oz': { code: 'oz', name: 'Ounces' },
  'lb': { code: 'lb', name: 'Pounds' },
  'kg': { code: 'kg', name: 'Kilograms' }
};

// Available weight units array for select components
export const weightUnits: WeightUnit[] = ['g', 'oz', 'lb', 'kg'];

// Helper to standardize weight unit to a consistent format
export function standardizeWeightUnit(unit: WeightUnitWithLegacy): WeightUnit {
  if (unit === 'lbs') return 'lb';
  return unit as WeightUnit;
}

// Helper function to get full weight unit information
export function getWeightUnitInfo(unit: WeightUnit): WeightUnitInfo {
  return weightUnitInfos[unit] || weightUnitInfos['lb']; // Default to pounds if invalid
}

// Helper function to get weight unit display name
export function getWeightUnitName(unit: WeightUnit): string {
  const unitInfo = getWeightUnitInfo(unit);
  return unitInfo.name;
}

// Basic pagination type
export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Basic sort configuration
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Common filter interface
export interface FilterConfig {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: string | number | boolean | Array<string | number>;
}
