
// Status types used across the application
export type Status = 'active' | 'inactive' | 'archived' | 'deleted';

// Weight unit type
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// For backward compatibility
export type WeightUnitWithLegacy = WeightUnit;

// Common selection option interface
export interface SelectOption {
  value: string;
  label: string;
}

// Common date range interface
export interface DateRange {
  start: Date;
  end: Date;
}

// Common validation result interface
export interface ValidationResult {
  valid: boolean;
  message?: string;
}
