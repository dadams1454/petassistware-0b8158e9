
import { supabase } from '@/integrations/supabase/client';
import { ApiError, ErrorType } from './errors';

// Type for table names to ensure type safety with Supabase
type TableName = string;

/**
 * Core API client that provides typed database access
 * with standardized error handling
 */
export const apiClient = {
  /**
   * Perform a typed select query
   */
  async select<T>(
    table: TableName, 
    options: {
      columns?: string;
      where?: Record<string, any>;
      eq?: [string, any][];
      order?: [string, { ascending: boolean }][];
      limit?: number;
      single?: boolean;
    } = {}
  ): Promise<T> {
    try {
      // Using the any type here to bypass the strict table name checking in Supabase
      // We're doing this because we're in mock data mode according to the project context
      let query = supabase.from(table as any).select(options.columns || '*');
      
      // Apply equality filters
      if (options.eq) {
        for (const [column, value] of options.eq) {
          query = query.eq(column, value);
        }
      }
      
      // Apply ordering
      if (options.order) {
        for (const [column, { ascending }] of options.order) {
          query = query.order(column, { ascending });
        }
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Get single record if requested
      if (options.single) {
        const { data, error } = await query.single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            throw new ApiError({
              type: ErrorType.NOT_FOUND,
              message: `No record found in ${table}`,
              originalError: error
            });
          }
          throw new ApiError({
            type: ErrorType.DATABASE,
            message: error.message,
            originalError: error
          });
        }
        
        return data as T;
      } else {
        const { data, error } = await query;
        
        if (error) {
          throw new ApiError({
            type: ErrorType.DATABASE,
            message: error.message,
            originalError: error
          });
        }
        
        return data as T;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        type: ErrorType.UNKNOWN,
        message: `Error querying ${table}`,
        originalError: error
      });
    }
  },
  
  /**
   * Insert data into a table
   */
  async insert<T, R = T>(
    table: TableName,
    data: T,
    options: { 
      returnData?: boolean;
      single?: boolean;
    } = {}
  ): Promise<R | null> {
    try {
      let query = supabase.from(table as any).insert(data);
      
      if (options.returnData !== false) {
        query = query.select();
        
        if (options.single) {
          const { data: responseData, error } = await query.single();
          
          if (error) {
            throw new ApiError({
              type: ErrorType.DATABASE,
              message: error.message,
              originalError: error
            });
          }
          
          return responseData as R;
        } else {
          const { data: responseData, error } = await query;
          
          if (error) {
            throw new ApiError({
              type: ErrorType.DATABASE,
              message: error.message,
              originalError: error
            });
          }
          
          // Handle potentially null responseData safely
          return (responseData && responseData.length > 0) ? responseData[0] as R : null;
        }
      } else {
        const { error } = await query;
        
        if (error) {
          throw new ApiError({
            type: ErrorType.DATABASE,
            message: error.message,
            originalError: error
          });
        }
        
        return null;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        type: ErrorType.UNKNOWN,
        message: `Error inserting into ${table}`,
        originalError: error
      });
    }
  },
  
  /**
   * Update data in a table
   */
  async update<T, R = T>(
    table: TableName,
    updates: Partial<T>,
    options: {
      eq: [string, any][];
      returnData?: boolean;
      single?: boolean;
    }
  ): Promise<R | null> {
    try {
      let query = supabase.from(table as any).update(updates);
      
      // Apply equality filters
      for (const [column, value] of options.eq) {
        query = query.eq(column, value);
      }
      
      if (options.returnData !== false) {
        query = query.select();
        
        if (options.single) {
          const { data: responseData, error } = await query.single();
          
          if (error) {
            throw new ApiError({
              type: ErrorType.DATABASE,
              message: error.message,
              originalError: error
            });
          }
          
          return responseData as R;
        } else {
          const { data: responseData, error } = await query;
          
          if (error) {
            throw new ApiError({
              type: ErrorType.DATABASE,
              message: error.message,
              originalError: error
            });
          }
          
          // Handle potentially null responseData safely
          return (responseData && responseData.length > 0) ? responseData[0] as R : null;
        }
      } else {
        const { error } = await query;
        
        if (error) {
          throw new ApiError({
            type: ErrorType.DATABASE,
            message: error.message,
            originalError: error
          });
        }
        
        return null;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        type: ErrorType.UNKNOWN,
        message: `Error updating ${table}`,
        originalError: error
      });
    }
  },
  
  /**
   * Delete data from a table
   */
  async delete(
    table: TableName,
    options: {
      eq: [string, any][];
    }
  ): Promise<void> {
    try {
      let query = supabase.from(table as any).delete();
      
      // Apply equality filters
      for (const [column, value] of options.eq) {
        query = query.eq(column, value);
      }
      
      const { error } = await query;
      
      if (error) {
        throw new ApiError({
          type: ErrorType.DATABASE,
          message: error.message,
          originalError: error
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        type: ErrorType.UNKNOWN,
        message: `Error deleting from ${table}`,
        originalError: error
      });
    }
  },
  
  /**
   * Execute a raw query (for complex operations)
   */
  raw: {
    supabase
  }
};
