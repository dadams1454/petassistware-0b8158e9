
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

// Weight units array for selecting in forms
export const weightUnits: SelectOption[] = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'lb', label: 'Pounds (lb)' }
];

// Helper function to standardize weight unit
export const standardizeWeightUnit = (unit?: string): WeightUnit => {
  if (!unit) return 'lb';
  
  const lowerUnit = unit.toLowerCase();
  
  if (lowerUnit === 'g' || lowerUnit === 'grams') return 'g';
  if (lowerUnit === 'kg' || lowerUnit === 'kilograms') return 'kg';
  if (lowerUnit === 'oz' || lowerUnit === 'ounces') return 'oz';
  if (lowerUnit === 'lb' || lowerUnit === 'lbs' || lowerUnit === 'pounds') return 'lb';
  
  return 'lb'; // Default fallback
};
