
// Gender type used throughout the application
export type Gender = 'Male' | 'Female' | 'Unknown';

// Weight unit type
export type WeightUnit = 'kg' | 'lb' | 'g' | 'oz';

// For backward compatibility with code that expects a string
export type WeightUnitWithLegacy = WeightUnit | string;

// Helper function to standardize weight unit values
export const standardizeWeightUnit = (unit?: string): WeightUnit => {
  if (!unit) return 'lb';
  
  const lowerUnit = unit.toLowerCase();
  
  if (lowerUnit === 'kg' || lowerUnit === 'kilograms' || lowerUnit === 'kilogram') {
    return 'kg';
  } else if (lowerUnit === 'g' || lowerUnit === 'grams' || lowerUnit === 'gram') {
    return 'g';
  } else if (lowerUnit === 'oz' || lowerUnit === 'ounce' || lowerUnit === 'ounces') {
    return 'oz';
  } else {
    return 'lb'; // Default to pounds
  }
};

// Available weight units for use in forms
export const weightUnits: WeightUnit[] = ['kg', 'lb', 'g', 'oz'];
