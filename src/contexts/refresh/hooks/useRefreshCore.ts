
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { RefreshableArea } from '../types';
import { useRefreshState } from './useRefreshState';
import { useCallbackRegistry } from './useCallbackRegistry';
import { ALL_REFRESH_AREAS } from '../utils';

export function useRefreshCore(enableToasts: boolean) {
  const {
    isRefreshing,
    setIsRefreshing,
    lastRefreshTime,
    setLastRefreshTime,
    currentDate,
    setCurrentDate,
    getTimeUntilNextRefresh,
    formatTimeRemaining
  } = useRefreshState(ALL_REFRESH_AREAS);
  
  const {
    registerCallback,
    triggerCallbacks,
    notifyDateChange
  } = useCallbackRegistry(ALL_REFRESH_AREAS);
  
  // Core refresh function
  const handleRefresh = useCallback(async (area: RefreshableArea, showToast = false) => {
    // Skip if already refreshing this area
    if (isRefreshing[area]) return;
    
    try {
      // Update refresh state
      setIsRefreshing(prev => ({
        ...prev,
        [area]: true,
        ...(area === 'all' ? { dailyCare: true, dashboard: true, dogs: true, puppies: true } : {})
      }));
      
      // Show toast if requested
      if (showToast && enableToasts) {
        toast({
          title: `Refreshing ${area === 'all' ? 'all data' : area}...`,
          description: "Please wait while we update the latest information.",
          duration: 3000,
        });
      }
      
      // Determine which areas to refresh
      const areasToRefresh: RefreshableArea[] = 
        area === 'all' 
          ? ['dailyCare', 'dashboard', 'dogs', 'puppies', 'all'] 
          : [area];
      
      // Execute all registered callbacks
      const refreshPromises = triggerCallbacks(areasToRefresh, currentDate, showToast);
      
      // Wait for all refresh operations to complete
      await Promise.all(refreshPromises);
      
      // Update last refresh time
      const now = new Date();
      setLastRefreshTime(prev => ({
        ...prev,
        [area]: now,
        ...(area === 'all' ? { dailyCare: now, dashboard: now, dogs: now, puppies: now } : {})
      }));
      
      // Show success toast if requested
      if (showToast && enableToasts) {
        toast({
          title: "Refresh complete",
          description: `Data has been updated successfully.`,
          duration: 3000,
        });
      }
      
    } catch (error) {
      console.error(`Error during ${area} refresh:`, error);
      
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: `Unable to update ${area === 'all' ? 'data' : area}. Please try again.`,
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      // Reset refresh state
      setIsRefreshing(prev => ({
        ...prev,
        [area]: false,
        ...(area === 'all' ? { dailyCare: false, dashboard: false, dogs: false, puppies: false } : {})
      }));
    }
  }, [isRefreshing, currentDate, enableToasts, setIsRefreshing, setLastRefreshTime, triggerCallbacks]);
  
  // Handle midnight date change
  const handleMidnightReached = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
    
    // Notify all registered components about date change
    notifyDateChange(ALL_REFRESH_AREAS, newDate);
    
    // Trigger refresh for all areas
    handleRefresh('all', true);
  }, [handleRefresh, notifyDateChange, setCurrentDate]);
  
  return {
    isRefreshing,
    lastRefreshTime,
    currentDate,
    handleRefresh,
    handleMidnightReached,
    registerCallback,
    getTimeUntilNextRefresh,
    formatTimeRemaining
  };
}
