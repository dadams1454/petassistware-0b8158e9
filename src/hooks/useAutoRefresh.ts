
import { useEffect, useCallback, useState } from 'react';
import { useRefresh, RefreshableArea } from '@/contexts/refreshContext';
import { useToast } from '@/components/ui/use-toast';
import { debounce } from 'lodash';
import { useDebouncedCallback } from './useDebouncedCallback';

interface AutoRefreshOptions {
  area?: RefreshableArea;
  interval?: number; // in milliseconds
  onRefresh: (date?: Date, force?: boolean) => Promise<any>;
  enableToasts?: boolean;
  refreshOnMount?: boolean;
  refreshLabel?: string;
  midnightReset?: boolean;
}

export const useAutoRefresh = ({
  area = 'dailyCare',
  interval = 15 * 60 * 1000, // Default: 15 minutes
  onRefresh,
  enableToasts = false,
  refreshOnMount = true,
  refreshLabel = 'data',
  midnightReset = false
}: AutoRefreshOptions) => {
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Wrap the onRefresh callback with error handling
  const safeOnRefresh = useCallback(async (date?: Date, force?: boolean) => {
    try {
      console.log(`🔄 Auto-refresh triggered for ${area} area`);
      const result = await onRefresh(date, force);
      console.log(`✅ Refresh for ${area} completed successfully`);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`❌ Refresh for ${area} failed:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      if (enableToasts) {
        toast({
          title: `Failed to refresh ${refreshLabel}`,
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return null;
    }
  }, [onRefresh, area, enableToasts, refreshLabel, toast]);
  
  // Use the centralized refresh context
  const { 
    isRefreshing, 
    handleRefresh, 
    currentDate, 
    formatTimeRemaining,
    setRefreshInterval,
    timeUntilNextRefresh
  } = useRefresh(area);
  
  // Set custom refresh interval if provided
  useEffect(() => {
    if (interval !== 15 * 60 * 1000) {
      try {
        console.log(`⏱️ Setting custom refresh interval for ${area}: ${interval}ms`);
        setRefreshInterval(interval);
      } catch (err) {
        console.error(`❌ Failed to set custom refresh interval for ${area}:`, err);
      }
    }
  }, [interval, setRefreshInterval, area]);
  
  // Initial refresh on mount if requested
  useEffect(() => {
    if (refreshOnMount && !isInitialized) {
      console.log(`🔄 Initial refresh on mount for ${area}`);
      safeOnRefresh(currentDate, false).then(() => {
        setIsInitialized(true);
        console.log(`✅ Initial refresh completed for ${area}`);
      });
    }
  }, [refreshOnMount, safeOnRefresh, currentDate, isInitialized, area]);
  
  // Create a debounced manual refresh handler using our custom hook
  const debouncedRefresh = useDebouncedCallback((showToast = true) => {
    console.log(`🖱️ Debounced manual refresh triggered for ${area}${showToast ? ' with toast' : ''}`);
    return handleRefresh(showToast).catch(err => {
      console.error(`❌ Manual refresh for ${area} failed:`, err);
      if (showToast && enableToasts) {
        toast({
          title: `Failed to refresh ${refreshLabel}`,
          description: err instanceof Error ? err.message : 'Unknown error',
          variant: "destructive",
        });
      }
      return null;
    });
  }, 300);
  
  // Create a manual refresh handler with enhanced logging
  const manualRefresh = useCallback((showToast = true) => {
    console.log(`🖱️ Manual refresh triggered for ${area}${showToast ? ' with toast' : ''}`);
    return debouncedRefresh(showToast);
  }, [debouncedRefresh, area]);
  
  return {
    isRefreshing,
    handleRefresh: manualRefresh,
    formatTimeRemaining,
    currentDate,
    error,
    timeUntilNextRefresh
  };
};
