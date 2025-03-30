
// Weight units and conversion functions

const WEIGHT_UNITS = {
  GRAMS: 'g',
  KILOGRAMS: 'kg',
  OUNCES: 'oz',
  POUNDS: 'lbs'
};

export const WEIGHT_UNIT_OPTIONS = [
  { value: WEIGHT_UNITS.GRAMS, label: 'Grams (g)' },
  { value: WEIGHT_UNITS.KILOGRAMS, label: 'Kilograms (kg)' },
  { value: WEIGHT_UNITS.OUNCES, label: 'Ounces (oz)' },
  { value: WEIGHT_UNITS.POUNDS, label: 'Pounds (lbs)' }
];

export const convertWeight = (weight: number, fromUnit: string, toUnit: string): number => {
  if (fromUnit === toUnit) return weight;

  // Convert to grams first (base unit)
  let weightInGrams = weight;
  
  switch (fromUnit) {
    case WEIGHT_UNITS.KILOGRAMS:
      weightInGrams = weight * 1000;
      break;
    case WEIGHT_UNITS.OUNCES:
      weightInGrams = weight * 28.3495;
      break;
    case WEIGHT_UNITS.POUNDS:
      weightInGrams = weight * 453.592;
      break;
    default:
      break;
  }

  // Convert from grams to target unit
  switch (toUnit) {
    case WEIGHT_UNITS.KILOGRAMS:
      return weightInGrams / 1000;
    case WEIGHT_UNITS.OUNCES:
      return weightInGrams / 28.3495;
    case WEIGHT_UNITS.POUNDS:
      return weightInGrams / 453.592;
    default:
      return weightInGrams;
  }
};

export default WEIGHT_UNITS;
