
// Weight Units
export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

export interface WeightUnitInfo {
  name: string;
  code: WeightUnit;
}

export const weightUnitInfos: Record<WeightUnit, WeightUnitInfo> = {
  lb: { name: 'Pounds', code: 'lb' },
  kg: { name: 'Kilograms', code: 'kg' },
  g: { name: 'Grams', code: 'g' },
  oz: { name: 'Ounces', code: 'oz' }
};

// Standardize weight unit values (for backward compatibility)
export const standardizeWeightUnit = (unit: string | WeightUnit): WeightUnit => {
  // Handle both old 'unit' and new 'weight_unit' fields
  const standardUnit = unit?.toLowerCase() as WeightUnit;
  if (Object.keys(weightUnitInfos).includes(standardUnit)) {
    return standardUnit;
  }
  return 'lb'; // Default fallback
};

// Get weight unit info
export const getWeightUnitInfo = (unit: WeightUnit): WeightUnitInfo => {
  return weightUnitInfos[unit] || weightUnitInfos.lb;
};

// Get weight unit name
export const getWeightUnitName = (unit: WeightUnit): string => {
  return getWeightUnitInfo(unit).name;
};
