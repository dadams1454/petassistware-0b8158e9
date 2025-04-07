
/**
 * Weight unit enum
 */
export enum WeightUnit {
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
}

/**
 * Weight units information array
 */
export const weightUnitInfos: WeightUnitInfo[] = [
  {
    value: WeightUnit.GRAMS,
    label: "Grams",
    displayUnit: "g",
    displayPrecision: 0,
    gramsPerUnit: 1
  },
  {
    value: WeightUnit.KILOGRAMS,
    label: "Kilograms",
    displayUnit: "kg",
    displayPrecision: 2,
    gramsPerUnit: 1000
  },
  {
    value: WeightUnit.OUNCES,
    label: "Ounces",
    displayUnit: "oz",
    displayPrecision: 1,
    gramsPerUnit: 28.3495
  },
  {
    value: WeightUnit.POUNDS,
    label: "Pounds",
    displayUnit: "lb",
    displayPrecision: 2,
    gramsPerUnit: 453.592
  }
];

/**
 * Standardize a weight unit from string input
 */
export const standardizeWeightUnit = (unit: string): WeightUnit => {
  const normalizedUnit = unit.toLowerCase();
  
  if (normalizedUnit === "g" || normalizedUnit === "gram" || normalizedUnit === "grams") {
    return WeightUnit.GRAMS;
  }
  
  if (normalizedUnit === "kg" || normalizedUnit === "kilogram" || normalizedUnit === "kilograms") {
    return WeightUnit.KILOGRAMS;
  }
  
  if (normalizedUnit === "oz" || normalizedUnit === "ounce" || normalizedUnit === "ounces") {
    return WeightUnit.OUNCES;
  }
  
  if (normalizedUnit === "lb" || normalizedUnit === "pound" || normalizedUnit === "pounds") {
    return WeightUnit.POUNDS;
  }
  
  // Default to grams if unit is not recognized
  return WeightUnit.GRAMS;
};

/**
 * Returns the most appropriate weight unit for a given weight in grams
 */
export const getAppropriateWeightUnit = (weightInGrams: number): WeightUnit => {
  if (weightInGrams < 100) {
    return WeightUnit.GRAMS;
  } else if (weightInGrams < 1000) {
    return WeightUnit.OUNCES;
  } else if (weightInGrams < 10000) {
    return WeightUnit.POUNDS;
  } else {
    return WeightUnit.KILOGRAMS;
  }
};
