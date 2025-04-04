
// Define reusable common types across the application
export type WeightUnit = 'g' | 'kg' | 'lb' | 'oz';

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
