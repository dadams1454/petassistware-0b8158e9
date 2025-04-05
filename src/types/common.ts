
// Define common types used across the application

// Weight unit type definition
export type WeightUnit = 'g' | 'oz' | 'lb' | 'kg';

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
