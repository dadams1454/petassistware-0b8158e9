
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { useDogSorting } from './pottyBreakHooks/useDogSorting';
import { useRefreshHandler } from './pottyBreakHooks/useRefreshHandler';
import { usePottyBreakData } from './pottyBreakHooks/usePottyBreakData';
import { useCareLogsData } from './pottyBreakHooks/useCareLogsData';
import { useCellActions } from './pottyBreakHooks/useCellActions';
import { useObservations } from './pottyBreakHooks/useObservations';
import { fetchGroupMembers } from '@/services/dailyCare/dogGroupsService';

const usePottyBreakTable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks',
  currentDate: Date = new Date()
) => {
  const navigate = useNavigate();
  
  // Cache previous data to prevent UI flicker
  const prevDogsRef = useRef<DogCareStatus[]>([]);
  const [stableDogsStatus, setStableDogsStatus] = useState<DogCareStatus[]>(dogsStatus);
  
  // Cache for group members
  const [groupMembersCache, setGroupMembersCache] = useState<{ [groupId: string]: string[] }>({});
  
  // Update stable dogs status only when meaningful changes occur
  useEffect(() => {
    // Skip empty updates
    if (dogsStatus.length === 0 && prevDogsRef.current.length > 0) {
      return;
    }
    
    // Compare arrays for meaningful differences (simplified)
    const hasChanged = dogsStatus.length !== prevDogsRef.current.length;
    
    if (hasChanged) {
      setStableDogsStatus(dogsStatus);
      prevDogsRef.current = dogsStatus;
    }
  }, [dogsStatus]);
  
  // Use the refactored hooks
  const { sortedDogs } = useDogSorting(stableDogsStatus);
  const { handleRefresh, isRefreshing } = useRefreshHandler(onRefresh);
  const { pottyBreaks, setPottyBreaks, isLoading: pottyBreaksLoading, fetchPottyBreaks, hasPottyBreak } = usePottyBreakData(currentDate);
  const { careLogs, fetchCareLogs, isLoading: careLogsLoading, hasCareLogged } = useCareLogsData(sortedDogs, activeCategory);
  const { observations, addObservation, hasObservation, getObservationDetails, isLoading: observationsLoading } = useObservations(sortedDogs);
  
  // Create optimized cell actions handler with debounced refresh
  const { handleCellClick, isLoading: cellActionsLoading } = useCellActions(
    currentDate, 
    pottyBreaks, 
    setPottyBreaks, 
    handleRefresh,
    activeCategory
  );
  
  // Combined loading state
  const isLoading = pottyBreaksLoading || careLogsLoading || cellActionsLoading || observationsLoading || isRefreshing;
  
  // Wrapper for hasCareLogged to incorporate hasPottyBreak
  const handleHasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    if (category === 'pottybreaks') {
      return hasPottyBreak(dogId, timeSlot);
    }
    return hasCareLogged(dogId, timeSlot, category);
  }, [hasCareLogged, hasPottyBreak]);

  // Enhanced hasObservation function that handles both dog ID and time slot with category
  const handleHasObservation = useCallback((dogId: string, timeSlot: string) => {
    // Pass the current active category to filter observations appropriately
    return hasObservation(dogId, timeSlot, activeCategory);
  }, [hasObservation, activeCategory]);

  // Enhanced getObservationDetails that passes the active category
  const handleGetObservationDetails = useCallback((dogId: string) => {
    // Pass the active category to filter observations
    return getObservationDetails(dogId, activeCategory);
  }, [getObservationDetails, activeCategory]);

  // Handle dog click to navigate to dog details page
  const handleDogClick = useCallback((dogId: string) => {
    navigate(`/dogs/${dogId}`);
  }, [navigate]);
  
  // Filter dogs by group
  const filterDogsByGroup = useCallback(async (dogs: DogCareStatus[], groupId: string) => {
    // Check if we already have the group members in cache
    if (!groupMembersCache[groupId]) {
      try {
        // Fetch group members from the API
        const members = await fetchGroupMembers(groupId);
        const memberIds = members.map(m => m.dog_id);
        
        // Update cache
        setGroupMembersCache(prev => ({
          ...prev,
          [groupId]: memberIds
        }));
        
        // Filter dogs by group members
        return dogs.filter(dog => memberIds.includes(dog.dog_id));
      } catch (error) {
        console.error('Error fetching group members:', error);
        return dogs;
      }
    } else {
      // Use cached group members
      const memberIds = groupMembersCache[groupId];
      return dogs.filter(dog => memberIds.includes(dog.dog_id));
    }
  }, [groupMembersCache]);

  return {
    currentDate,
    isLoading,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged: handleHasCareLogged,
    hasObservation: handleHasObservation,
    getObservationDetails: handleGetObservationDetails,
    addObservation,
    observations,
    handleCellClick,
    handleRefresh,
    handleDogClick,
    filterDogsByGroup
  };
};

export default usePottyBreakTable;
