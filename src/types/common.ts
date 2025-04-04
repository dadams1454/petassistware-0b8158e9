
// Common types used across the application

// Weight unit type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Date range type
export interface DateRange {
  start: Date;
  end: Date;
}

// Standard ID type
export type ID = string;

// Status type for enabled/disabled
export type Status = 'active' | 'inactive';

// Simple coordinate type
export interface Coordinates {
  x: number;
  y: number;
}

// Basic pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// Generic response status
export interface ResponseStatus {
  success: boolean;
  message?: string;
  code?: number;
}
