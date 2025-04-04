
// Common types shared across the application

// Weight unit type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit with legacy support
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// Date range type
export interface DateRange {
  start: Date;
  end: Date;
}

// Time of day options
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Status type
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'archived';

// Alert levels
export type AlertLevel = 'info' | 'success' | 'warning' | 'error';

// Common id type
export type ID = string;

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Sort params
export interface SortParams {
  field: string;
  direction: SortDirection;
}

// Filter operator
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';

// Filter param
export interface FilterParam {
  field: string;
  operator: FilterOperator;
  value: any;
}

// Query params
export interface QueryParams {
  pagination?: PaginationParams;
  sort?: SortParams[];
  filters?: FilterParam[];
}
