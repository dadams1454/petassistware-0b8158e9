
export function calculatePercentChange(currentWeight: number, previousWeight: number): number {
  if (previousWeight === 0) return 0;
  return ((currentWeight - previousWeight) / previousWeight) * 100;
}

export const weightUnits = [
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
];
