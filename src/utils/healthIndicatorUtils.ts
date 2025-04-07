
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
    case AppetiteLevel.EXCELLENT:
      return AppetiteEnum.EXCELLENT;
    case AppetiteLevel.GOOD:
      return AppetiteEnum.GOOD;
    case AppetiteLevel.FAIR:
      return AppetiteEnum.FAIR;
    case AppetiteLevel.POOR:
      return AppetiteEnum.POOR;
    case AppetiteLevel.NONE:
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
    case EnergyLevel.HYPERACTIVE:
      return EnergyEnum.HYPERACTIVE;
    case EnergyLevel.HIGH:
      return EnergyEnum.HIGH;
    case EnergyLevel.NORMAL:
      return EnergyEnum.NORMAL;
    case EnergyLevel.LOW:
      return EnergyEnum.LOW;
    case EnergyLevel.LETHARGIC:
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
    case StoolConsistency.NORMAL:
      return StoolConsistencyEnum.NORMAL;
    case StoolConsistency.SOFT:
      return StoolConsistencyEnum.SOFT;
    case StoolConsistency.LOOSE:
      return StoolConsistencyEnum.LOOSE;
    case StoolConsistency.WATERY:
      return StoolConsistencyEnum.WATERY;
    case StoolConsistency.HARD:
      return StoolConsistencyEnum.HARD;
    case StoolConsistency.BLOODY:
      return StoolConsistencyEnum.BLOODY;
    case StoolConsistency.MUCUS:
      return StoolConsistencyEnum.MUCUS;
    default:
      return 'Unknown';
  }
};

/**
 * Check if an appetite level is concerning
 */
export const isAppetiteConcerning = (level: AppetiteLevel): boolean => {
  return level === AppetiteLevel.NONE || level === AppetiteLevel.POOR;
};

/**
 * Check if an energy level is concerning
 */
export const isEnergyConcerning = (level: EnergyLevel): boolean => {
  return level === EnergyLevel.LETHARGIC || level === EnergyLevel.LOW;
};

/**
 * Check if a stool consistency is concerning
 */
export const isStoolConcerning = (consistency: StoolConsistency): boolean => {
  return (
    consistency === StoolConsistency.WATERY ||
    consistency === StoolConsistency.BLOODY ||
    consistency === StoolConsistency.MUCUS
  );
};

/**
 * Get a color for displaying appetite level
 */
export const getAppetiteColor = (level: AppetiteLevel): string => {
  switch (level) {
    case AppetiteLevel.EXCELLENT:
      return 'text-green-600';
    case AppetiteLevel.GOOD:
      return 'text-green-500';
    case AppetiteLevel.FAIR:
      return 'text-yellow-500';
    case AppetiteLevel.POOR:
      return 'text-orange-500';
    case AppetiteLevel.NONE:
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
    case EnergyLevel.HYPERACTIVE:
      return 'text-purple-500';
    case EnergyLevel.HIGH:
      return 'text-blue-500';
    case EnergyLevel.NORMAL:
      return 'text-green-500';
    case EnergyLevel.LOW:
      return 'text-orange-500';
    case EnergyLevel.LETHARGIC:
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
    case StoolConsistency.NORMAL:
      return 'text-green-500';
    case StoolConsistency.SOFT:
      return 'text-yellow-500';
    case StoolConsistency.LOOSE:
      return 'text-orange-400';
    case StoolConsistency.WATERY:
      return 'text-red-500';
    case StoolConsistency.HARD:
      return 'text-orange-500';
    case StoolConsistency.BLOODY:
      return 'text-red-600';
    case StoolConsistency.MUCUS:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};
