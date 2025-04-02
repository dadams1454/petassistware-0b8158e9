
// Define types for our welping hooks
import { Litter } from '@/types/litter';
import { Dog } from '@/types/reproductive';

export interface WelpingQueryHookResult {
  pregnantDogs: Dog[];
  activeWelpings: Litter[];
  recentLitters: Litter[];
  isLoadingPregnant: boolean;
  isErrorPregnant: boolean;
  errorPregnant: any;
  isLoadingActive: boolean;
  isErrorActive: boolean;
  errorActive: any;
  isLoadingRecent: boolean;
  isErrorRecent: boolean;
  errorRecent: any;
}

export interface WelpingMutationHookResult {
  deleteLitter: (litterId: string) => Promise<void>;
  updateLitterStatus: (litter: Litter) => Promise<void>;
  markLitterAsWhelping: (litter: Litter) => Promise<void>;
}

export interface WelpingManagementState {
  pregnantDogs: Dog[];
  activeWelpings: Litter[];
  activeLitters: Litter[]; // For backward compatibility
  upcomingWelpings: Litter[]; // For backward compatibility
  recentLitters: Litter[];
  pregnantCount: number;
  activeWelpingsCount: number;
  totalPuppiesCount: number;
  isLoading: boolean;
  isError: boolean;
  error: any;
}
