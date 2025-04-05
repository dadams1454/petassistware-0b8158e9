
// Define common types used across the application

// Weight unit type definition
export type WeightUnit = 'g' | 'oz' | 'lb' | 'kg';

// Legacy weight unit for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// For backwards compatibility
export interface WeightUnitOption {
  code: string;
  name: string;
}

// Convert WeightUnit to WeightUnitOption for UI display
export const weightUnitOptions: Record<WeightUnit, WeightUnitOption> = {
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
