
import { WeightUnitOption } from './types';

export const weightUnits: WeightUnitOption[] = [
  {
    label: 'Ounces (oz)',
    value: 'oz',
    conversion: {
      oz: 1,
      g: 28.3495,
      lbs: 0.0625,
      kg: 0.0283495
    }
  },
  {
    label: 'Grams (g)',
    value: 'g',
    conversion: {
      oz: 0.035274,
      g: 1,
      lbs: 0.00220462,
      kg: 0.001
    }
  },
  {
    label: 'Pounds (lbs)',
    value: 'lbs',
    conversion: {
      oz: 16,
      g: 453.592,
      lbs: 1,
      kg: 0.453592
    }
  },
  {
    label: 'Kilograms (kg)',
    value: 'kg',
    conversion: {
      oz: 35.274,
      g: 1000,
      lbs: 2.20462,
      kg: 1
    }
  }
];

export const convertWeight = (
  weight: number, 
  fromUnit: 'oz' | 'g' | 'lbs' | 'kg', 
  toUnit: 'oz' | 'g' | 'lbs' | 'kg'
): number => {
  if (fromUnit === toUnit) return weight;
  
  const unitFrom = weightUnits.find(unit => unit.value === fromUnit);
  if (!unitFrom) return weight;
  
  const conversionFactor = unitFrom.conversion[toUnit];
  return Number((weight * conversionFactor).toFixed(2));
};

export const calculatePercentChange = (currentWeight: number, previousWeight: number): number => {
  if (previousWeight === 0) return 0;
  const change = ((currentWeight - previousWeight) / previousWeight) * 100;
  return Number(change.toFixed(1));
};

export const formatWeight = (weight: number, unit: 'oz' | 'g' | 'lbs' | 'kg'): string => {
  return `${weight} ${unit}`;
};
