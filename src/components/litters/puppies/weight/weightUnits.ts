
export const weightUnits = [
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'kg', label: 'Kilograms (kg)' }
];

// Conversion rates
const CONVERSION_RATES = {
  'oz_to_g': 28.3495,
  'oz_to_lbs': 0.0625,
  'oz_to_kg': 0.0283495,
  'g_to_oz': 0.035274,
  'g_to_lbs': 0.00220462,
  'g_to_kg': 0.001,
  'lbs_to_oz': 16,
  'lbs_to_g': 453.592,
  'lbs_to_kg': 0.453592,
  'kg_to_oz': 35.274,
  'kg_to_g': 1000,
  'kg_to_lbs': 2.20462
};

/**
 * Convert weight between different units
 */
export function convertWeight(
  weight: number,
  fromUnit: 'oz' | 'g' | 'lbs' | 'kg',
  toUnit: 'oz' | 'g' | 'lbs' | 'kg'
): number {
  // If units are the same, no conversion needed
  if (fromUnit === toUnit) {
    return weight;
  }
  
  const conversionKey = `${fromUnit}_to_${toUnit}` as keyof typeof CONVERSION_RATES;
  const conversionRate = CONVERSION_RATES[conversionKey];
  
  if (!conversionRate) {
    console.error(`Conversion from ${fromUnit} to ${toUnit} not supported`);
    return weight;
  }
  
  return weight * conversionRate;
}

/**
 * Calculate percent change between two weights
 */
export function calculatePercentChange(currentWeight: number, previousWeight: number): number {
  if (previousWeight === 0) return 0;
  return ((currentWeight - previousWeight) / previousWeight) * 100;
}

/**
 * Format weight with appropriate unit label
 */
export function formatWeightWithUnit(weight: number, unit: 'oz' | 'g' | 'lbs' | 'kg'): string {
  // Round to 2 decimal places for better display
  const roundedWeight = Math.round(weight * 100) / 100;
  
  switch (unit) {
    case 'oz':
      return `${roundedWeight} oz`;
    case 'g':
      return `${roundedWeight} g`;
    case 'lbs':
      return `${roundedWeight} lbs`;
    case 'kg':
      return `${roundedWeight} kg`;
    default:
      return `${roundedWeight}`;
  }
}
