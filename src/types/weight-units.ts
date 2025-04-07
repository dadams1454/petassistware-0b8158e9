
/**
 * Weight unit type
 */
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

/**
 * Weight unit enum
 */
export enum WeightUnitEnum {
  GRAMS = "g",
  KILOGRAMS = "kg",
  OUNCES = "oz",
  POUNDS = "lb"
}

/**
 * Weight unit info object
 */
export interface WeightUnitInfo {
  value: WeightUnit;
  label: string;
  displayUnit: string;
  displayPrecision: number;
  gramsPerUnit: number;
  id: string;
  name: string;
}

/**
 * Weight units information array
 */
export const weightUnitInfos: WeightUnitInfo[] = [
  {
    value: 'g',
    label: "Grams",
    displayUnit: "g",
    displayPrecision: 0,
    gramsPerUnit: 1,
    id: 'g',
    name: "Grams"
  },
  {
    value: 'kg',
    label: "Kilograms",
    displayUnit: "kg",
    displayPrecision: 2,
    gramsPerUnit: 1000,
    id: 'kg',
    name: "Kilograms"
  },
  {
    value: 'oz',
    label: "Ounces",
    displayUnit: "oz",
    displayPrecision: 1,
    gramsPerUnit: 28.3495,
    id: 'oz',
    name: "Ounces"
  },
  {
    value: 'lb',
    label: "Pounds",
    displayUnit: "lb",
    displayPrecision: 2,
    gramsPerUnit: 453.592,
    id: 'lb',
    name: "Pounds"
  }
];

/**
 * Standardize a weight unit from string input
 */
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const normalizedUnit = unit.toLowerCase();
  
  if (normalizedUnit === "g" || normalizedUnit === "gram" || normalizedUnit === "grams") {
    return 'g';
  }
  
  if (normalizedUnit === "kg" || normalizedUnit === "kilogram" || normalizedUnit === "kilograms") {
    return 'kg';
  }
  
  if (normalizedUnit === "oz" || normalizedUnit === "ounce" || normalizedUnit === "ounces") {
    return 'oz';
  }
  
  if (normalizedUnit === "lb" || normalizedUnit === "pound" || normalizedUnit === "pounds") {
    return 'lb';
  }
  
  // Default to grams if unit is not recognized
  return 'g';
};

/**
 * Returns the most appropriate weight unit for a given weight in grams
 */
export const getAppropriateWeightUnit = (weightInGrams: number): WeightUnit => {
  if (weightInGrams < 100) {
    return 'g';
  } else if (weightInGrams < 1000) {
    return 'oz';
  } else if (weightInGrams < 10000) {
    return 'lb';
  } else {
    return 'kg';
  }
};
