
import { toast } from '@/hooks/use-toast';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Standard error types for application
 */
export enum ErrorType {
  FETCH_ERROR = 'fetch_error',
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  PERMISSION_ERROR = 'permission_error',
  NOT_FOUND_ERROR = 'not_found_error',
  SERVER_ERROR = 'server_error',
  UNKNOWN_ERROR = 'unknown_error'
}

/**
 * Standardized error response
 */
export interface ApplicationError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  code?: string;
}

/**
 * Handle Supabase errors in a consistent way
 */
export const handleSupabaseError = (error: PostgrestError | Error | null): ApplicationError => {
  if (!error) {
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: 'An unknown error occurred'
    };
  }

  // Check if it's a PostgrestError from Supabase
  if ('code' in error) {
    const postgrestError = error as PostgrestError;
    
    switch (postgrestError.code) {
      case '42501':
        return {
          type: ErrorType.PERMISSION_ERROR,
          message: 'You do not have permission to perform this action',
          originalError: error,
          code: postgrestError.code
        };
      case '23505':
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: 'A record with this information already exists',
          originalError: error,
          code: postgrestError.code
        };
      case 'PGRST116':
        return {
          type: ErrorType.NOT_FOUND_ERROR,
          message: 'The requested resource was not found',
          originalError: error,
          code: postgrestError.code
        };
      default:
        return {
          type: ErrorType.SERVER_ERROR,
          message: postgrestError.message || 'An error occurred while communicating with the server',
          originalError: error,
          code: postgrestError.code
        };
    }
  }
  
  // Generic error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error.message || 'An unexpected error occurred',
    originalError: error
  };
};

/**
 * Display a toast notification for an error
 */
export const showErrorToast = (error: ApplicationError) => {
  toast({
    title: getErrorTitle(error.type),
    description: error.message,
    variant: 'destructive',
  });
};

/**
 * Get a user-friendly title based on error type
 */
const getErrorTitle = (errorType: ErrorType): string => {
  switch (errorType) {
    case ErrorType.FETCH_ERROR:
      return 'Data Fetch Error';
    case ErrorType.VALIDATION_ERROR:
      return 'Validation Error';
    case ErrorType.AUTHENTICATION_ERROR:
      return 'Authentication Error';
    case ErrorType.PERMISSION_ERROR:
      return 'Permission Error';
    case ErrorType.NOT_FOUND_ERROR:
      return 'Not Found';
    case ErrorType.SERVER_ERROR:
      return 'Server Error';
    case ErrorType.UNKNOWN_ERROR:
    default:
      return 'Error';
  }
};
