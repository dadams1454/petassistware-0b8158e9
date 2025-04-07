
import { 
  AppetiteLevel, 
  EnergyLevel, 
  StoolConsistency,
  isAppetiteLevel,
  isEnergyLevel, 
  isStoolConsistency,
  safelyConvertValue
} from '@/types';

/**
 * Get the display label for an appetite level
 */
export function getAppetiteLevelLabel(level: AppetiteLevel): string {
  const appetiteLabels: Record<AppetiteLevel, string> = {
    'excellent': 'Excellent',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor',
    'none': 'None'
  };
  return appetiteLabels[level] || 'Unknown';
}

/**
 * Get the display label for an energy level
 */
export function getEnergyLevelLabel(level: EnergyLevel): string {
  const energyLabels: Record<EnergyLevel, string> = {
    'hyperactive': 'Hyperactive',
    'high': 'High',
    'normal': 'Normal',
    'low': 'Low',
    'lethargic': 'Lethargic'
  };
  return energyLabels[level] || 'Unknown';
}

/**
 * Get the display label for a stool consistency
 */
export function getStoolConsistencyLabel(consistency: StoolConsistency): string {
  const consistencyLabels: Record<StoolConsistency, string> = {
    'normal': 'Normal',
    'soft': 'Soft',
    'loose': 'Loose',
    'watery': 'Watery',
    'hard': 'Hard',
    'bloody': 'Bloody',
    'mucus': 'Contains Mucus'
  };
  return consistencyLabels[consistency] || 'Unknown';
}

/**
 * Safely convert a value to an appetite level
 */
export function toAppetiteLevel(value: unknown): AppetiteLevel {
  return safelyConvertValue(value, 'normal', isAppetiteLevel);
}

/**
 * Safely convert a value to an energy level
 */
export function toEnergyLevel(value: unknown): EnergyLevel {
  return safelyConvertValue(value, 'normal', isEnergyLevel);
}

/**
 * Safely convert a value to a stool consistency
 */
export function toStoolConsistency(value: unknown): StoolConsistency {
  return safelyConvertValue(value, 'normal', isStoolConsistency);
}

/**
 * Get color for appetite level
 */
export function getAppetiteLevelColor(level: AppetiteLevel): string {
  const colors: Record<AppetiteLevel, string> = {
    'excellent': 'bg-green-100 text-green-800',
    'good': 'bg-green-50 text-green-700',
    'fair': 'bg-yellow-100 text-yellow-800',
    'poor': 'bg-orange-100 text-orange-800',
    'none': 'bg-red-100 text-red-800'
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
}

/**
 * Get color for energy level
 */
export function getEnergyLevelColor(level: EnergyLevel): string {
  const colors: Record<EnergyLevel, string> = {
    'hyperactive': 'bg-purple-100 text-purple-800',
    'high': 'bg-blue-100 text-blue-800',
    'normal': 'bg-green-100 text-green-800',
    'low': 'bg-yellow-100 text-yellow-800',
    'lethargic': 'bg-red-100 text-red-800'
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
}

/**
 * Get color for stool consistency
 */
export function getStoolConsistencyColor(consistency: StoolConsistency): string {
  const colors: Record<StoolConsistency, string> = {
    'normal': 'bg-green-100 text-green-800',
    'soft': 'bg-yellow-50 text-yellow-700',
    'loose': 'bg-yellow-100 text-yellow-800',
    'watery': 'bg-orange-100 text-orange-800',
    'hard': 'bg-amber-100 text-amber-800',
    'bloody': 'bg-red-100 text-red-800',
    'mucus': 'bg-purple-100 text-purple-800'
  };
  return colors[consistency] || 'bg-gray-100 text-gray-800';
}
