
// Common type definitions for the application
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Weight unit information with display names and conversion rates
export interface WeightUnitInfo {
  id: WeightUnit;
  name: string;
  conversionToG: number;
}

export type WeightUnitOption = {
  value: WeightUnit;
  label: string;
};

// Weight unit conversion and display utilities
export const weightUnitInfos: Record<WeightUnit, WeightUnitInfo> = {
  'g': { id: 'g', name: 'Grams', conversionToG: 1 },
  'kg': { id: 'kg', name: 'Kilograms', conversionToG: 1000 },
  'oz': { id: 'oz', name: 'Ounces', conversionToG: 28.3495 },
  'lb': { id: 'lb', name: 'Pounds', conversionToG: 453.59237 }
};

export const weightUnits: WeightUnitInfo[] = [
  { id: 'oz', name: 'Ounces', conversionToG: 28.3495 },
  { id: 'g', name: 'Grams', conversionToG: 1 },
  { id: 'lb', name: 'Pounds', conversionToG: 453.59237 },
  { id: 'kg', name: 'Kilograms', conversionToG: 1000 }
];

export const weightUnitOptions: WeightUnitOption[] = [
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'kg', label: 'Kilograms (kg)' }
];

// Helper function to standardize weight unit values
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const normalized = unit.toLowerCase();
  
  if (normalized === 'oz' || normalized === 'ounce' || normalized === 'ounces') {
    return 'oz';
  } else if (normalized === 'g' || normalized === 'gram' || normalized === 'grams') {
    return 'g';
  } else if (normalized === 'lb' || normalized === 'lbs' || normalized === 'pound' || normalized === 'pounds') {
    return 'lb';
  } else if (normalized === 'kg' || normalized === 'kilogram' || normalized === 'kilograms') {
    return 'kg';
  }
  
  // Default to pounds if not recognized
  return 'lb';
};

// Helper functions for working with weight units
export const getWeightUnitInfo = (unit: WeightUnit): WeightUnitInfo => {
  return weightUnitInfos[unit] || weightUnitInfos.lb;
};

export const getWeightUnitName = (unit: WeightUnit): string => {
  return getWeightUnitInfo(unit).name;
};

// Helper types for genetic data
export interface BreedComposition {
  primary?: string;
  secondary?: string;
  mixed?: boolean;
  breeds?: Array<{breed: string, percentage: number}>;
}

export interface ColorGenetics {
  base?: string;
  dilution?: string;
  brown_dilution?: string;
  agouti?: string;
  mask?: string;
  pattern?: string;
}

export interface GeneticTraitResults {
  color?: ColorGenetics;
  size?: {
    expected_weight?: number;
    height_category?: string;
  };
  coat?: {
    type?: string;
    length?: string;
    shedding?: string;
  };
}
