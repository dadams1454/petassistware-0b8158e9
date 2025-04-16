
/**
 * Reproductive module types
 */

export * from '@/types/reproductive';
export * from '@/types/heat-cycles';

// Additional module-specific types
export interface ReproductiveMetrics {
  averageCycleLength?: number;
  cyclesPerYear?: number;
  averageLitterSize?: number;
  fertileDaysPerCycle?: number;
}

export interface HeatCycleTrackingStats {
  lastCycleDate?: string;
  nextCycleDate?: string;
  daysUntilNextCycle?: number;
  averageDaysBetweenCycles?: number;
  totalCyclesRecorded: number;
}

export interface ReproductiveServiceInfo {
  breedingFee?: number;
  availableForBreeding?: boolean;
  breedingRestrictions?: string[];
  studsAvailable?: boolean;
  requiresGenericTesting?: boolean;
}
