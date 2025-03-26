
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';
import { useDailyCare } from '@/contexts/dailyCare';

export const useDashboardState = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [careLogDialogOpen, setCareLogDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  const pendingRefreshRef = useRef(false);

  // Use the centralized refresh context
  const { formatTimeRemaining, currentDate } = useRefresh();
  
  // Use the refresh data hook for dogs
  const { 
    data: dogStatuses, 
    isLoading: isRefreshing, 
    refresh: handleRefreshDogs 
  } = useRefreshData({
    key: 'allDogs',
    fetchData: async () => {
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
    dependencies: [currentDate],
    loadOnMount: true
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If we have a pending refresh and tab changes, refresh the data
    if (pendingRefreshRef.current) {
      setTimeout(() => {
        handleRefreshDogs(false);
        pendingRefreshRef.current = false;
      }, 100);
    }
  };

  const handleCareLogClick = () => {
    setCareLogDialogOpen(true);
  };

  const handleCareLogSuccess = () => {
    setCareLogDialogOpen(false);
    setSelectedDogId(null);
    
    // Instead of immediate refresh, set a flag for next tab change or use debounce
    pendingRefreshRef.current = true;
    
    // Schedule a delayed silent refresh to catch changes
    setTimeout(() => {
      handleRefreshDogs(false);
      pendingRefreshRef.current = false;
    }, 1000);
  };

  const handleDogSelected = (dogId: string) => {
    setSelectedDogId(dogId);
  };
  
  // Handler for manual refresh with UI feedback
  const handleManualRefresh = () => {
    // Show toast for feedback
    toast({
      title: 'Refreshing data...',
      description: 'Updating the latest dog care information',
      duration: 2000,
    });
    
    // Use the refresh function from the hook
    handleRefreshDogs(false);
  };

  const handleErrorReset = () => {
    console.log('Resetting tab after error');
    handleRefreshDogs(true);
  };

  return {
    activeTab,
    setActiveTab,
    careLogDialogOpen,
    setCareLogDialogOpen,
    selectedDogId,
    setSelectedDogId,
    dogStatuses,
    isRefreshing,
    handleTabChange,
    handleCareLogClick,
    handleCareLogSuccess,
    handleDogSelected,
    handleManualRefresh,
    handleErrorReset,
    currentDate
  };
};
