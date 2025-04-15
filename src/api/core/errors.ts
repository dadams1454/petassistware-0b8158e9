
import { toast } from '@/hooks/use-toast';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Standardized error types for the application
 */
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATABASE = 'database',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

/**
 * Base API error with standardized structure
 */
export class ApiError extends Error {
  public type: ErrorType;
  public originalError?: unknown;
  public details?: Record<string, any>;

  constructor({
    type = ErrorType.UNKNOWN,
    message,
    originalError,
    details
  }: {
    type?: ErrorType;
    message: string;
    originalError?: unknown;
    details?: Record<string, any>;
  }) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.originalError = originalError;
    this.details = details;
  }

  /**
   * Converts Supabase PostgrestError to ApiError
   */
  static fromSupabaseError(error: PostgrestError): ApiError {
    if (!error) {
      return new ApiError({
        type: ErrorType.UNKNOWN,
        message: 'Unknown error occurred'
      });
    }

    // Handle specific Supabase error codes
    switch (error.code) {
      case '42501': // Permission denied
        return new ApiError({
          type: ErrorType.AUTHORIZATION,
          message: 'You do not have permission to perform this action',
          originalError: error
        });
      case '23505': // Unique violation
        return new ApiError({
          type: ErrorType.VALIDATION,
          message: 'A record with this information already exists',
          originalError: error
        });
      case 'PGRST116': // No rows returned
        return new ApiError({
          type: ErrorType.NOT_FOUND,
          message: 'The requested resource was not found',
          originalError: error
        });
      case '23503': // Foreign key violation
        return new ApiError({
          type: ErrorType.VALIDATION,
          message: 'This operation violates database constraints',
          originalError: error
        });
      case '28000': // Invalid credentials
        return new ApiError({
          type: ErrorType.AUTHENTICATION,
          message: 'Authentication failed',
          originalError: error
        });
      default:
        return new ApiError({
          type: ErrorType.DATABASE,
          message: error.message || 'A database error occurred',
          originalError: error
        });
    }
  }

  /**
   * Show a toast notification for this error
   */
  showToast(): void {
    toast({
      title: this.getErrorTitle(),
      description: this.message,
      variant: 'destructive',
    });
  }

  /**
   * Get a user-friendly title based on error type
   */
  private getErrorTitle(): string {
    switch (this.type) {
      case ErrorType.AUTHENTICATION:
        return 'Authentication Error';
      case ErrorType.AUTHORIZATION:
        return 'Permission Error';
      case ErrorType.DATABASE:
        return 'Database Error';
      case ErrorType.VALIDATION:
        return 'Validation Error';
      case ErrorType.NOT_FOUND:
        return 'Not Found';
      case ErrorType.SERVER:
        return 'Server Error';
      case ErrorType.NETWORK:
        return 'Network Error';
      case ErrorType.UNKNOWN:
      default:
        return 'Error';
    }
  }
}

/**
 * Utility functions for handling errors
 */
export const errorHandlers = {
  /**
   * Handle an error with standardized logging and display
   */
  handleError: (error: unknown, context?: string): ApiError => {
    // Convert to ApiError if it's not already
    const apiError = error instanceof ApiError
      ? error
      : new ApiError({
          type: ErrorType.UNKNOWN,
          message: error instanceof Error ? error.message : 'An unknown error occurred',
          originalError: error
        });
    
    // Log the error with context
    console.error(`Error${context ? ` in ${context}` : ''}:`, apiError);
    
    // Return the standardized error
    return apiError;
  },
  
  /**
   * Show a toast for an error
   */
  showErrorToast: (error: unknown, context?: string): void => {
    const apiError = errorHandlers.handleError(error, context);
    apiError.showToast();
  }
};
