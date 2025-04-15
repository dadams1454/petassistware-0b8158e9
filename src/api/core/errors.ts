
/**
 * Error types for the API client
 */
export enum ErrorType {
  UNKNOWN = 'unknown',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  VALIDATION = 'validation',
  DATABASE = 'database',
  NETWORK = 'network',
  SERVER = 'server',
  INPUT = 'input'
}

/**
 * API Error options
 */
export interface ApiErrorOptions {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  type: ErrorType;
  originalError?: unknown;
  code?: string;
  details?: Record<string, any>;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = 'ApiError';
    this.type = options.type;
    this.originalError = options.originalError;
    this.code = options.code;
    this.details = options.details;
  }

  /**
   * Get a user-friendly error message
   */
  getFriendlyMessage(): string {
    switch (this.type) {
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ErrorType.UNAUTHORIZED:
        return 'You need to log in to access this resource.';
      case ErrorType.FORBIDDEN:
        return 'You do not have permission to access this resource.';
      case ErrorType.VALIDATION:
        return 'The provided data is invalid.';
      case ErrorType.DATABASE:
        return 'There was a problem with the database operation.';
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection.';
      case ErrorType.SERVER:
        return 'Server error. Please try again later.';
      case ErrorType.INPUT:
        return 'Invalid input provided.';
      default:
        return 'An unexpected error occurred.';
    }
  }

  /**
   * Get HTTP status code for the error
   */
  getStatusCode(): number {
    switch (this.type) {
      case ErrorType.NOT_FOUND:
        return 404;
      case ErrorType.UNAUTHORIZED:
        return 401;
      case ErrorType.FORBIDDEN:
        return 403;
      case ErrorType.VALIDATION:
      case ErrorType.INPUT:
        return 400;
      case ErrorType.DATABASE:
      case ErrorType.SERVER:
        return 500;
      default:
        return 500;
    }
  }
}

// Error Handlers object for various error handling operations
export const errorHandlers = {
  /**
   * Handle API errors and show a toast message if needed
   */
  showErrorToast: (error: unknown, context = 'api') => {
    // For now just log to console in mock mode
    console.error(`Error in ${context}:`, error);
    
    // Here we would integrate with a toast system
    // toast({
    //   title: "Error",
    //   description: error instanceof ApiError ? error.getFriendlyMessage() : "An unexpected error occurred",
    //   variant: "destructive",
    // });
  },
  
  /**
   * Parse and transform error from API response
   */
  parseApiError: (error: any, context?: string): ApiError => {
    if (error instanceof ApiError) {
      return error;
    }
    
    // Parse common error patterns
    const message = error?.message || error?.error?.message || 'An unknown error occurred';
    const code = error?.code || error?.error?.code;
    const details = error?.details || error?.error?.details;
    
    // Determine error type
    let type = ErrorType.UNKNOWN;
    
    // Try to infer type from status code or message
    if (error?.status === 404 || error?.code === 'not_found') {
      type = ErrorType.NOT_FOUND;
    } else if (error?.status === 401 || error?.code === 'unauthorized') {
      type = ErrorType.UNAUTHORIZED;
    } else if (error?.status === 403 || error?.code === 'forbidden') {
      type = ErrorType.FORBIDDEN;
    } else if (error?.status === 400 || error?.code === 'validation') {
      type = ErrorType.VALIDATION;
    }
    
    return new ApiError({
      type,
      message,
      code,
      details,
      originalError: error
    });
  }
};
