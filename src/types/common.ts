
// Define common types used across the application

// Weight units for consistent use throughout the app
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight units with display information
export const weightUnits = [
  { id: 'oz', label: 'Ounces', abbr: 'oz', conversionToG: 28.3495 },
  { id: 'g', label: 'Grams', abbr: 'g', conversionToG: 1 },
  { id: 'lb', label: 'Pounds', abbr: 'lb', conversionToG: 453.592 },
  { id: 'kg', label: 'Kilograms', abbr: 'kg', conversionToG: 1000 }
];

// Common date format
export type DateFormat = 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'yyyy-MM-dd';

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'archived';

// Common currency types
export type Currency = 'USD' | 'CAD' | 'EUR' | 'GBP';

// Common frequency types for medications, feedings, etc.
export const FrequencyTypes = {
  ONCE: 'once',
  DAILY: 'daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as_needed',
  // Additional frequencies for health records
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  ONCE_DAILY: 'once_daily'
};

// Health related enums
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}
