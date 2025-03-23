
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useRefresh, RefreshableArea } from '@/contexts/refreshContext';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect, useCallback } from 'react';

interface QueryWithRefreshOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError, TData, string[]>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  area?: RefreshableArea;
  enableToasts?: boolean;
  refreshLabel?: string;
}

export function useQueryWithRefresh<TData, TError = Error>({
  queryKey,
  queryFn,
  area = 'dashboard',
  enableToasts = false,
  refreshLabel = 'data',
  staleTime = 15 * 60 * 1000, // Default to 15 minutes
  ...options
}: QueryWithRefreshOptions<TData, TError>): UseQueryResult<TData, TError> & { 
  manualRefresh: (showToast?: boolean) => Promise<void>
} {
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Use the centralized refresh context
  const { 
    lastRefreshTime,
    handleRefresh, 
    registerCallback,
  } = useRefresh(area);
  
  // React Query setup with staleTime
  const queryResult = useQuery({
    queryKey,
    queryFn,
    staleTime,
    ...options
  });
  
  // Manual refresh function that triggers both React Query refetch and notifies the refresh context
  const manualRefresh = useCallback(async (showToast: boolean = false) => {
    try {
      console.log(`🔄 Manual refresh triggered for ${queryKey.join('.')}${showToast ? ' with toast' : ''}`);
      
      if (showToast && enableToasts) {
        toast({
          title: `Refreshing ${refreshLabel}...`,
          description: "Please wait while we update the latest information.",
          duration: 3000,
        });
      }
      
      // Trigger React Query's refetch
      await queryResult.refetch();
      
      // Notify the refresh context
      handleRefresh(false);
      
      if (showToast && enableToasts) {
        toast({
          title: "Refresh complete",
          description: `${refreshLabel} has been updated successfully.`,
          duration: 3000,
        });
      }
    } catch (err) {
      console.error(`❌ Manual refresh for ${queryKey.join('.')} failed:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      if (showToast && enableToasts) {
        toast({
          title: `Failed to refresh ${refreshLabel}`,
          description: err instanceof Error ? err.message : 'Unknown error',
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }, [queryResult, handleRefresh, queryKey, enableToasts, refreshLabel, toast]);

  // Listen to the refresh context's lastRefreshTime changes
  useEffect(() => {
    // Register this component's refresh callback
    const unregister = registerCallback(area, {
      onRefresh: async () => {
        console.log(`🔄 Refresh callback triggered from context for ${queryKey.join('.')}`);
        await queryResult.refetch();
        return true;
      }
    });
    
    return unregister;
  }, [registerCallback, area, queryResult, queryKey]);
  
  // Return both React Query result and our manual refresh function
  return {
    ...queryResult,
    manualRefresh
  };
}
