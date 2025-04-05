
// Define common types used across the application

// Weight unit type definition
export type WeightUnit = 'g' | 'oz' | 'lb' | 'kg';

// Legacy weight unit for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// For backwards compatibility
export interface WeightUnitOption {
  label: string;  // Changed from code to label for Select components
  value: WeightUnit;  // Changed from name to value for Select components
}

// Convert WeightUnit to WeightUnitOption for UI display
export const weightUnitOptions: Record<WeightUnit, WeightUnitOption> = {
  'g': { value: 'g', label: 'Grams' },
  'oz': { value: 'oz', label: 'Ounces' },
  'lb': { value: 'lb', label: 'Pounds' },
  'kg': { value: 'kg', label: 'Kilograms' }
};

// Available weight units array for select components
export const weightUnits: WeightUnit[] = ['g', 'oz', 'lb', 'kg'];

// Helper to standardize weight unit to a consistent format
export function standardizeWeightUnit(unit: WeightUnitWithLegacy): WeightUnit {
  if (unit === 'lbs') return 'lb';
  return unit as WeightUnit;
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
