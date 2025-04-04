
// Common type definitions used across multiple modules

// Define weight unit type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight units for selects and conversion
export const weightUnits = [
  { code: 'lb', name: 'Pounds (lb)' },
  { code: 'kg', name: 'Kilograms (kg)' },
  { code: 'oz', name: 'Ounces (oz)' },
  { code: 'g', name: 'Grams (g)' }
];

// Common status types shared across modules
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'archived';

// Common user role type
export type UserRole = 'admin' | 'staff' | 'breeder' | 'vet' | 'viewer';

// Common interface for audit fields
export interface AuditFields {
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Common interface for pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Common interface for sorting
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Common interface for filtering
export interface FilterParams {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
  value: string | number | boolean | null;
}

// Common response for paginated data
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Re-export for legacy code compatibility
export type WeightUnitWithLegacy = WeightUnit | string;
