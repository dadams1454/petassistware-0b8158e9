
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useRefreshTimestamp } from '@/contexts/refreshTimestamp';
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface QueryWithRefreshOptions<TData, TError> extends 
  Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  area?: string;
  enableToasts?: boolean;
  refreshLabel?: string;
}

export function useQueryWithRefresh<TData, TError = Error>({
  queryKey,
  queryFn,
  area = 'data',
  enableToasts = false,
  refreshLabel = 'data',
  ...options
}: QueryWithRefreshOptions<TData, TError>): UseQueryResult<TData, TError> & {
  manualRefresh: (showToast?: boolean) => Promise<void>;
} {
  const { lastRefresh } = useRefreshTimestamp();
  const { toast } = useToast();
  
  // Include the refresh timestamp in the query key to trigger refetches
  const enhancedQueryKey = [...queryKey, lastRefresh.toISOString()];
  
  // Create the query
  const query = useQuery<TData, TError>({
    queryKey: enhancedQueryKey,
    queryFn,
    ...options,
  });
  
  // Manual refresh function
  const manualRefresh = useCallback(async (showToast = false) => {
    if (showToast && enableToasts) {
      toast({
        title: `Refreshing ${refreshLabel}...`,
        description: "Fetching the latest information",
        duration: 2000,
      });
    }
    
    try {
      await query.refetch();
      
      if (showToast && enableToasts) {
        toast({
          title: "Refresh complete",
          description: `Latest ${refreshLabel} loaded successfully`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error(`Error refreshing ${area}:`, error);
      
      if (showToast && enableToasts) {
        toast({
          title: "Refresh failed",
          description: `Unable to update ${refreshLabel}. Please try again.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, [query, area, enableToasts, toast, refreshLabel]);
  
  return {
    ...query,
    manualRefresh
  };
}
