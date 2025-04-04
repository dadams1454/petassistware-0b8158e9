
// Define reusable common types across the application
export type WeightUnit = 'g' | 'kg' | 'lb' | 'oz';

export type Gender = 'Male' | 'Female';

export interface SelectOption {
  value: string;
  label: string;
  code?: string;
  name?: string;
  description?: React.ReactNode;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ErrorState = {
  message: string;
  details?: string;
} | null;

export interface PaginationParams {
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ErrorState;
  isLoading: boolean;
}

export interface FilterParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Helper functions for weight unit standardization
export const weightUnits: Record<string, WeightUnit> = {
  g: 'g',
  gram: 'g',
  grams: 'g',
  kg: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  lb: 'lb',
  lbs: 'lb',
  pound: 'lb',
  pounds: 'lb',
  oz: 'oz',
  ounce: 'oz',
  ounces: 'oz'
};

export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const standardized = weightUnits[unit.toLowerCase()];
  return standardized || 'lb'; // Default to lb if unknown
};

export type WeightUnitWithLegacy = WeightUnit | 'pound' | 'pounds' | 'ounce' | 'ounces' | 'gram' | 'grams' | 'kilogram' | 'kilograms';
