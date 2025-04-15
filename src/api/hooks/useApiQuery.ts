
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { ApiError, errorHandlers } from '../core/errors';

/**
 * Enhanced version of useQuery with standardized error handling
 */
export function useApiQuery<TData, TError = ApiError>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, unknown[]>, 'queryKey' | 'queryFn'> & {
    showErrorToast?: boolean;
    errorContext?: string;
  }
): UseQueryResult<TData, TError> {
  const { showErrorToast = true, errorContext, ...queryOptions } = options || {};
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        if (showErrorToast) {
          errorHandlers.showErrorToast(error, errorContext || queryKey.join(':'));
        }
        throw error;
      }
    },
    ...queryOptions
  });
}
