
/**
 * Health indicator utility functions
 */
import { 
  AppetiteLevel, 
  EnergyLevel, 
  StoolConsistency,
  HealthIndicator
} from '@/types';
import { 
  isAppetiteLevel, 
  isEnergyLevel, 
  isStoolConsistency,
  safelyConvertValue
} from './typeGuards';

/**
 * Validate and normalize a health indicator object
 * @param data Partial health indicator data
 * @returns Normalized health indicator data
 */
export function normalizeHealthIndicator(data: Partial<HealthIndicator>): Partial<HealthIndicator> {
  return {
    ...data,
    appetite: safelyConvertValue(data.appetite, isAppetiteLevel, 'normal' as AppetiteLevel),
    energy: safelyConvertValue(data.energy, isEnergyLevel, 'normal' as EnergyLevel),
    stool_consistency: safelyConvertValue(data.stool_consistency, isStoolConsistency, 'normal' as StoolConsistency)
  };
}

/**
 * Check if a health indicator has abnormal values
 * @param indicator Health indicator object
 * @returns True if any values are abnormal
 */
export function hasAbnormalValues(indicator: Partial<HealthIndicator>): boolean {
  const appetiteAbnormal = indicator.appetite && 
    (indicator.appetite === 'poor' || indicator.appetite === 'none');
    
  const energyAbnormal = indicator.energy && 
    (indicator.energy === 'low' || indicator.energy === 'lethargic');
    
  const stoolAbnormal = indicator.stool_consistency && 
    (indicator.stool_consistency !== 'normal');
    
  return appetiteAbnormal || energyAbnormal || stoolAbnormal;
}
