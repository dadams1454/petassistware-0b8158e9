
// Common type definitions used across the application

// Standardized weight unit type used throughout the application
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';

/**
 * Standardizes weight unit values from various sources
 * This helps when data might come with different casing or formats (lbs vs lb)
 */
export function standardizeWeightUnit(unit: string): WeightUnit {
  const normalizedUnit = unit.toLowerCase();
  
  if (normalizedUnit === 'lbs' || normalizedUnit === 'lb' || normalizedUnit === 'pound' || normalizedUnit === 'pounds') {
    return 'lb';
  } else if (normalizedUnit === 'kg' || normalizedUnit === 'kgs' || normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms') {
    return 'kg';
  } else if (normalizedUnit === 'oz' || normalizedUnit === 'ounce' || normalizedUnit === 'ounces') {
    return 'oz';
  } else if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams') {
    return 'g';
  }
  
  // Default to lb if unknown unit is provided
  console.warn(`Unknown weight unit: ${unit}, defaulting to lb`);
  return 'lb';
}
