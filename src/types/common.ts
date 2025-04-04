
// Weight units
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

// Legacy weight units for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'pounds' | 'kilograms' | 'grams' | 'ounces';

// Define weight units for UI
export const weightUnits = [
  { code: 'lb', name: 'Pounds (lb)' },
  { code: 'kg', name: 'Kilograms (kg)' },
  { code: 'g', name: 'Grams (g)' },
  { code: 'oz', name: 'Ounces (oz)' }
];

// Function to standardize weight units
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  // Convert legacy units to standardized ones
  const unitMap: Record<string, WeightUnit> = {
    'lb': 'lb',
    'kg': 'kg',
    'g': 'g',
    'oz': 'oz',
    'pounds': 'lb',
    'kilograms': 'kg',
    'grams': 'g',
    'ounces': 'oz',
    'pound': 'lb',
    'kilogram': 'kg',
    'gram': 'g',
    'ounce': 'oz'
  };
  
  return unitMap[unit.toLowerCase()] || 'lb';
};

// Available weight units for UI
export const weightUnitOptions = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'oz', label: 'Ounces (oz)' }
];

// Generic status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

// Pagination params for API requests
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API response with pagination metadata
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

// Dog gender options
export type Gender = 'Male' | 'Female';

// Base tenant entity with common fields
export interface TenantEntity {
  id: string;
  created_at: string;
  updated_at?: string;
  tenant_id?: string;
}
