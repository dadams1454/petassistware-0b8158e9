
export const weightUnits = [
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'kg', label: 'Kilograms (kg)' }
];

export const calculatePercentChange = (
  currentWeight: number,
  previousWeight: number
): number => {
  if (!previousWeight) return 0;
  return ((currentWeight - previousWeight) / previousWeight) * 100;
};

export const convertWeight = (
  weight: number,
  fromUnit: string,
  toUnit: string
): number => {
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first as a common unit
  let weightInGrams = weight;
  
  // Convert from original unit to grams
  switch (fromUnit) {
    case 'oz':
      weightInGrams = weight * 28.3495;
      break;
    case 'lbs':
      weightInGrams = weight * 453.592;
      break;
    case 'kg':
      weightInGrams = weight * 1000;
      break;
  }
  
  // Convert from grams to target unit
  switch (toUnit) {
    case 'oz':
      return weightInGrams / 28.3495;
    case 'lbs':
      return weightInGrams / 453.592;
    case 'kg':
      return weightInGrams / 1000;
    default:
      return weightInGrams;
  }
};

export default weightUnits;
