
/**
 * Common types shared across the application
 */

// Weight unit type that can be used throughout the app
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

/**
 * Standardize weight unit to ensure consistency
 * Handles potential variations like 'lbs' -> 'lb'
 */
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  // Convert to lowercase for consistent comparison
  const lowerUnit = unit.toLowerCase();
  
  // Handle common variations
  if (lowerUnit === 'lbs' || lowerUnit === 'pound' || lowerUnit === 'pounds') {
    return 'lb';
  }
  if (lowerUnit === 'g' || lowerUnit === 'gram' || lowerUnit === 'grams') {
    return 'g';
  }
  if (lowerUnit === 'kg' || lowerUnit === 'kilogram' || lowerUnit === 'kilograms') {
    return 'kg';
  }
  if (lowerUnit === 'oz' || lowerUnit === 'ounce' || lowerUnit === 'ounces') {
    return 'oz';
  }
  
  // Default to ounces if unit is not recognized
  return 'oz';
};

/**
 * Interface for handling API errors
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

/**
 * Basic metadata interface for timestamps
 */
export interface TimeStamps {
  created_at: string;
  updated_at?: string;
}

/**
 * Interface for pagination controls
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Interface for sort options
 */
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Base entity interface all domain objects extend from
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
  tenant_id?: string;
}
