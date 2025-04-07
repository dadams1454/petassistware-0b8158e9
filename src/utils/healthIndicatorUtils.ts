
import { 
  AppetiteLevel, 
  EnergyLevel, 
  StoolConsistency,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum
} from '@/types';

/**
 * Get a display label for appetite level
 */
export const getAppetiteLevelLabel = (level: AppetiteLevel): string => {
  switch (level) {
    case 'excellent':
      return AppetiteEnum.EXCELLENT;
    case 'good':
      return AppetiteEnum.GOOD;
    case 'fair':
      return AppetiteEnum.FAIR;
    case 'poor':
      return AppetiteEnum.POOR;
    case 'none':
      return AppetiteEnum.NONE;
    default:
      return 'Unknown';
  }
};

/**
 * Get a display label for energy level
 */
export const getEnergyLevelLabel = (level: EnergyLevel): string => {
  switch (level) {
    case 'hyperactive':
      return EnergyEnum.HYPERACTIVE;
    case 'high':
      return EnergyEnum.HIGH;
    case 'normal':
      return EnergyEnum.NORMAL;
    case 'low':
      return EnergyEnum.LOW;
    case 'lethargic':
      return EnergyEnum.LETHARGIC;
    default:
      return 'Unknown';
  }
};

/**
 * Get a display label for stool consistency
 */
export const getStoolConsistencyLabel = (consistency: StoolConsistency): string => {
  switch (consistency) {
    case 'normal':
      return StoolConsistencyEnum.NORMAL;
    case 'soft':
      return StoolConsistencyEnum.SOFT;
    case 'loose':
      return StoolConsistencyEnum.LOOSE;
    case 'watery':
      return StoolConsistencyEnum.WATERY;
    case 'hard':
      return StoolConsistencyEnum.HARD;
    case 'bloody':
      return StoolConsistencyEnum.BLOODY;
    case 'mucus':
      return StoolConsistencyEnum.MUCUS;
    default:
      return 'Unknown';
  }
};

/**
 * Check if an appetite level is concerning
 */
export const isAppetiteConcerning = (level: AppetiteLevel): boolean => {
  return level === 'none' || level === 'poor';
};

/**
 * Check if an energy level is concerning
 */
export const isEnergyConcerning = (level: EnergyLevel): boolean => {
  return level === 'lethargic' || level === 'low';
};

/**
 * Check if a stool consistency is concerning
 */
export const isStoolConcerning = (consistency: StoolConsistency): boolean => {
  return (
    consistency === 'watery' ||
    consistency === 'bloody' ||
    consistency === 'mucus'
  );
};

/**
 * Get a color for displaying appetite level
 */
export const getAppetiteColor = (level: AppetiteLevel): string => {
  switch (level) {
    case 'excellent':
      return 'text-green-600';
    case 'good':
      return 'text-green-500';
    case 'fair':
      return 'text-yellow-500';
    case 'poor':
      return 'text-orange-500';
    case 'none':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Get a color for displaying energy level
 */
export const getEnergyColor = (level: EnergyLevel): string => {
  switch (level) {
    case 'hyperactive':
      return 'text-purple-500';
    case 'high':
      return 'text-blue-500';
    case 'normal':
      return 'text-green-500';
    case 'low':
      return 'text-orange-500';
    case 'lethargic':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Get a color for displaying stool consistency
 */
export const getStoolColor = (consistency: StoolConsistency): string => {
  switch (consistency) {
    case 'normal':
      return 'text-green-500';
    case 'soft':
      return 'text-yellow-500';
    case 'loose':
      return 'text-orange-400';
    case 'watery':
      return 'text-red-500';
    case 'hard':
      return 'text-orange-500';
    case 'bloody':
      return 'text-red-600';
    case 'mucus':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};
