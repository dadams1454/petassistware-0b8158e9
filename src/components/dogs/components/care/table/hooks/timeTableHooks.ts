
import { useState, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { ObservationType } from '../components/observation/ObservationDialog';

// Debug state hook
export const useDebugState = () => {
  const [debugInfo, setDebugInfo] = useState<any>({ lastAction: 'init' });
  const clickCountRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  
  return { 
    debugInfo, 
    setDebugInfo, 
    clickCountRef, 
    errorCountRef 
  };
};

// Category management hook
export const useCategoryManagement = (
  setDebugInfo: (info: any) => void,
  clickCountRef: React.MutableRefObject<number>,
  initialCategory: string = 'feeding'
) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const handleCategoryChange = useCallback((category: string) => {
    setDebugInfo({ lastAction: `Category changed to ${category}` });
    clickCountRef.current += 1;
    setActiveCategory(category);
  }, [setDebugInfo, clickCountRef]);

  return { activeCategory, handleCategoryChange };
};

// Dialog state hook
export const useDialogState = (activeCategory: string) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [observationDialogOpen, setObservationDialogOpen] = useState<boolean>(false);
  const [selectedDogId, setSelectedDogId] = useState<string>('');

  return {
    isDialogOpen,
    setIsDialogOpen,
    observationDialogOpen,
    setObservationDialogOpen,
    selectedDogId,
    setSelectedDogId
  };
};

// Handlers hook
export const useHandlers = (
  activeCategory: string,
  clickCountRef: React.MutableRefObject<number>,
  errorCountRef: React.MutableRefObject<number>,
  setDebugInfo: (info: any) => void,
  setSelectedDogId: (dogId: string) => void,
  setObservationDialogOpen: (open: boolean) => void,
  handleCellClick: (dogId: string, hour: number) => void,
  onRefresh: () => void
) => {
  // Handler for dog row clicks
  const handleDogClick = useCallback((dogId: string) => {
    clickCountRef.current += 1;
    setDebugInfo({ lastAction: `Dog clicked: ${dogId}` });
    setSelectedDogId(dogId);
  }, [clickCountRef, setDebugInfo, setSelectedDogId]);
  
  // Handler for care log clicks
  const handleCareLogClick = useCallback((dogId: string) => {
    clickCountRef.current += 1;
    setDebugInfo({ lastAction: `Care log clicked: ${dogId}` });
    // Implementation would go here
  }, [clickCountRef, setDebugInfo]);
  
  // Handler for observation clicks
  const handleObservationClick = useCallback((dogId: string, hour: number) => {
    clickCountRef.current += 1;
    setDebugInfo({ lastAction: `Observation clicked: ${dogId} at hour ${hour}` });
    setSelectedDogId(dogId);
    setObservationDialogOpen(true);
  }, [clickCountRef, setDebugInfo, setSelectedDogId, setObservationDialogOpen]);
  
  // Memoized cell click handler
  const memoizedCellClickHandler = useCallback((dogId: string, hour: number) => {
    clickCountRef.current += 1;
    setDebugInfo({ lastAction: `Cell clicked: ${dogId} at hour ${hour}` });
    handleCellClick(dogId, hour);
  }, [clickCountRef, setDebugInfo, handleCellClick]);
  
  // Handler for error reset
  const handleErrorReset = useCallback(() => {
    errorCountRef.current = 0;
    setDebugInfo({ lastAction: 'Error reset' });
    onRefresh();
  }, [errorCountRef, setDebugInfo, onRefresh]);

  return {
    handleDogClick,
    handleCareLogClick,
    handleObservationClick,
    memoizedCellClickHandler,
    handleCellContextMenu: useCallback((e: React.MouseEvent, dogId: string, hour: number) => {
      e.preventDefault();
      clickCountRef.current += 1;
      setDebugInfo({ lastAction: `Cell right-clicked: ${dogId} at hour ${hour}` });
    }, [clickCountRef, setDebugInfo]),
    handleErrorReset
  };
};

// Observation handling hook
export const useObservationHandling = (
  dogsStatus: DogCareStatus[],
  activeCategory: string,
  onRefresh: () => void
) => {
  const [observations, setObservations] = useState<Record<string, any[]>>({});

  // Handler for observation submission
  const handleObservationSubmit = useCallback(async (
    dogId: string, 
    observation: string, 
    observationType: ObservationType,
    timestamp?: Date
  ): Promise<void> => {
    console.log('Observation submitted:', { dogId, observation, observationType, timestamp });
    
    // Store the observation locally (would typically be saved to a database)
    setObservations(prev => {
      const dogObservations = prev[dogId] || [];
      return {
        ...prev,
        [dogId]: [
          ...dogObservations,
          {
            id: Date.now().toString(),
            observation,
            observation_type: observationType,
            created_at: (timestamp || new Date()).toISOString()
          }
        ]
      };
    });
    
    // After submission, refresh the data
    onRefresh();
    
    // Return a resolved promise to satisfy TypeScript
    return Promise.resolve();
  }, [onRefresh, setObservations]);

  return { observations, handleObservationSubmit };
};
