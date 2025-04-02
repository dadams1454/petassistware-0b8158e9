
import { Dog } from '@/types/reproductive';
import { Litter } from '@/types/litter';

export interface WelpingManagementState {
  pregnantDogs: Dog[];
  activeWelpings: any[];
  activeLitters: any[]; 
  upcomingWelpings: any[];
  recentLitters: any[];
  activeWelpingsCount: number;
  pregnantCount: number;
  totalPuppiesCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export interface WelpingQueryHookResult {
  pregnantDogs: Dog[];
  activeWelpings: any[];
  recentLitters: any[];
  isLoadingPregnant: boolean;
  isErrorPregnant: boolean;
  errorPregnant: Error | null;
  isLoadingActive: boolean;
  isErrorActive: boolean;
  errorActive: Error | null;
  isLoadingRecent: boolean;
  isErrorRecent: boolean;
  errorRecent: Error | null;
}

export interface WelpingMutationHookResult {
  deleteLitter: (litterId: string) => Promise<void>;
  updateLitterStatus: (litter: Litter) => Promise<void>;
  markLitterAsWhelping: (litter: Litter) => Promise<void>;
}

export interface WelpingStatsResult {
  pregnantCount: number;
  activeWelpingsCount: number;
  totalPuppiesCount: number;
}
