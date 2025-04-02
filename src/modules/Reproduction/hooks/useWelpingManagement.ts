
import { useWelpingQueries } from './useWelpingQueries';
import { useWelpingMutations } from './useWelpingMutations';
import { calculateWelpingStats } from './useWelpingStats';
import { WelpingManagementState } from './welpingTypes';
import { Litter } from '@/types/litter';

export const useWelpingManagement = (): WelpingManagementState & {
  deleteLitter: (litterId: string) => Promise<void>;
  updateLitterStatus: (litter: Litter) => Promise<void>;
  markLitterAsWhelping: (litter: Litter) => Promise<void>;
} => {
  // Use our separated hooks
  const {
    pregnantDogs,
    activeWelpings,
    recentLitters,
    isLoadingPregnant,
    isErrorPregnant,
    errorPregnant,
    isLoadingActive,
    isErrorActive,
    errorActive,
    isLoadingRecent,
    isErrorRecent,
    errorRecent
  } = useWelpingQueries();
  
  const {
    deleteLitter,
    updateLitterStatus,
    markLitterAsWhelping
  } = useWelpingMutations();
  
  // Calculate statistics
  const { pregnantCount, activeWelpingsCount, totalPuppiesCount } = calculateWelpingStats(
    pregnantDogs,
    activeWelpings,
    recentLitters
  );
  
  // Combine loading states
  const isLoading = isLoadingPregnant || isLoadingActive || isLoadingRecent;
  
  // Combine errors
  const isError = isErrorPregnant || isErrorActive || isErrorRecent;
  const error = errorPregnant || errorActive || errorRecent;
  
  return {
    pregnantDogs,
    activeWelpings,
    activeLitters: activeWelpings, // Map activeWelpings to activeLitters for backward compatibility
    upcomingWelpings: [], // Kept for backward compatibility
    recentLitters,
    pregnantCount,
    activeWelpingsCount,
    totalPuppiesCount,
    isLoading,
    isError,
    error,
    deleteLitter,
    updateLitterStatus,
    markLitterAsWhelping,
  };
};
