
/**
 * Core type definitions
 * This file contains the base types used throughout the application
 */

// Export base JSON type from Supabase
export type { Json } from '../supabase';

// Basic ID and timestamp types used throughout the app
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Standard date formats
export type DateString = string; // ISO format YYYY-MM-DD
export type DateTimeString = string; // ISO format YYYY-MM-DDTHH:mm:ss.sssZ

// Common status values
export type Status = 'active' | 'inactive' | 'archived' | 'completed' | 'pending';

// Common result type for async operations
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Re-export enums that are used across multiple modules
export * from '../enums';
