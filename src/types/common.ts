
// Common types used across the application

// Weight unit type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Legacy weight unit type for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | string;

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

// Weight units array for dropdown options
export const weightUnits = [
  { code: 'oz', name: 'Ounces (oz)' },
  { code: 'g', name: 'Grams (g)' },
  { code: 'lb', name: 'Pounds (lb)' },
  { code: 'kg', name: 'Kilograms (kg)' }
];

// Helper function to standardize weight unit
export function standardizeWeightUnit(unit?: string): WeightUnit {
  if (!unit) return 'lb';
  
  const lowerUnit = unit.toLowerCase();
  
  switch (lowerUnit) {
    case 'oz':
    case 'ounce':
    case 'ounces':
      return 'oz';
    case 'g':
    case 'gram':
    case 'grams':
      return 'g';
    case 'lb':
    case 'lbs':
    case 'pound':
    case 'pounds':
      return 'lb';
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return 'kg';
    default:
      return 'lb'; // Default to pounds if unknown
  }
}
