
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

export default weightUnits;
