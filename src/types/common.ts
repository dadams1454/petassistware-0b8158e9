// Common types used across the application

// Weight unit type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Legacy type alias for backward compatibility
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// Weight unit metadata (name, symbol, conversion ratio)
export interface WeightUnitInfo {
  code: WeightUnit;
  name: string;
  symbol: string;
  toGrams: number; // Conversion ratio to grams
}

// Standard weight units with metadata
export const weightUnits: WeightUnitInfo[] = [
  { code: 'oz', name: 'Ounces', symbol: 'oz', toGrams: 28.35 },
  { code: 'g', name: 'Grams', symbol: 'g', toGrams: 1 },
  { code: 'lb', name: 'Pounds', symbol: 'lb', toGrams: 453.59 },
  { code: 'kg', name: 'Kilograms', symbol: 'kg', toGrams: 1000 }
];

// Standardize weight unit for consistency (handle legacy 'lbs')
export const standardizeWeightUnit = (unit?: WeightUnitWithLegacy): WeightUnit => {
  if (!unit) return 'lb';
  if (unit === 'lbs') return 'lb';
  return unit;
};

// Other common types can be added here

// Date format options
export interface DateFormatOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  use12Hour?: boolean;
  dateOnly?: boolean;
}

// Status types
export type EntityStatus = 'active' | 'inactive' | 'archived' | 'deleted';

// Common pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}
