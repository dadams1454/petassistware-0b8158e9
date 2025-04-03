
// Common utility types shared across the application

// Weight unit options
export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';

// Legacy compatibility for code that used the enum
export type WeightUnitWithLegacy = WeightUnit;

// Status type for general use
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'archived';

// UUID validation result interface
export interface UuidValidationResult {
  valid: boolean;
  message?: string;
}

// Common tenant-related interfaces
export interface TenantInfo {
  id: string;
  name: string;
  created_at: string;
}

// User role types
export type UserRole = 'admin' | 'breeder' | 'staff' | 'viewer';

// Pagination options
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Basic form field validation
export interface FieldValidation {
  isValid: boolean;
  message?: string;
}

// Notification type 
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

// Utility function to standardize weight unit
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  if (unit === 'lbs') return 'lb';
  if (['oz', 'g', 'kg', 'lb'].includes(unit as WeightUnit)) {
    return unit as WeightUnit;
  }
  return 'lb'; // Default fallback
};

// Weight unit options for dropdowns and selections
export const weightUnits: { value: WeightUnit; label: string }[] = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' }
];
