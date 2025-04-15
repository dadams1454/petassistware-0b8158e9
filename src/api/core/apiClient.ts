
import { ApiError, ErrorType } from './errors';

// Mock database for development
const mockDatabase: Record<string, any[]> = {};

// Type for table names to ensure type safety
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
      // Initialize table if it doesn't exist
      if (!mockDatabase[table]) {
        mockDatabase[table] = [];
      }
      
      // Get data from mock database
      let results = [...mockDatabase[table]];
      
      // Apply filters
      if (options.eq) {
        for (const [column, value] of options.eq) {
          results = results.filter(record => record[column] === value);
        }
      }
      
      // Apply ordering
      if (options.order) {
        for (const [column, { ascending }] of options.order) {
          results.sort((a, b) => {
            if (ascending) {
              return a[column] > b[column] ? 1 : -1;
            } else {
              return a[column] < b[column] ? 1 : -1;
            }
          });
        }
      }
      
      // Apply limit
      if (options.limit) {
        results = results.slice(0, options.limit);
      }
      
      // Handle single record request
      if (options.single) {
        if (results.length === 0) {
          throw new ApiError({
            type: ErrorType.NOT_FOUND,
            message: `No record found in ${table}`,
            originalError: new Error('Record not found')
          });
        }
        
        return results[0] as T;
      }
      
      return results as T;
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
      // Initialize table if it doesn't exist
      if (!mockDatabase[table]) {
        mockDatabase[table] = [];
      }
      
      // Generate ID if not provided
      const recordWithId = {
        ...data,
        id: (data as any).id || crypto.randomUUID()
      };
      
      // Add timestamp if not provided
      if (!(recordWithId as any).created_at) {
        (recordWithId as any).created_at = new Date().toISOString();
      }
      
      // Add to mock database
      mockDatabase[table].push(recordWithId);
      
      // Return data if requested
      if (options.returnData !== false) {
        if (options.single) {
          return recordWithId as R;
        } else {
          return [recordWithId] as R;
        }
      }
      
      return null;
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
      // Initialize table if it doesn't exist
      if (!mockDatabase[table]) {
        mockDatabase[table] = [];
      }
      
      // Find records to update
      let recordsToUpdate: any[] = [];
      for (const record of mockDatabase[table]) {
        let shouldUpdate = true;
        
        // Check all equality filters
        for (const [column, value] of options.eq) {
          if (record[column] !== value) {
            shouldUpdate = false;
            break;
          }
        }
        
        if (shouldUpdate) {
          recordsToUpdate.push(record);
        }
      }
      
      // Update records
      for (const record of recordsToUpdate) {
        Object.assign(record, updates);
        
        // Add updated_at if not provided
        if (!(record as any).updated_at) {
          (record as any).updated_at = new Date().toISOString();
        }
      }
      
      // Return data if requested
      if (options.returnData !== false) {
        if (options.single) {
          return recordsToUpdate[0] as R;
        } else {
          return recordsToUpdate as R;
        }
      }
      
      return null;
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
      // Initialize table if it doesn't exist
      if (!mockDatabase[table]) {
        mockDatabase[table] = [];
        return;
      }
      
      // Find records to delete
      const newRecords = mockDatabase[table].filter(record => {
        for (const [column, value] of options.eq) {
          if (record[column] === value) {
            return false; // Filter out record to delete
          }
        }
        return true; // Keep record
      });
      
      // Update table
      mockDatabase[table] = newRecords;
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
   * Access to mock database for testing
   */
  _mock: {
    getDatabase: () => mockDatabase,
    setDatabase: (data: Record<string, any[]>) => {
      Object.assign(mockDatabase, data);
    },
    clearDatabase: () => {
      for (const table in mockDatabase) {
        delete mockDatabase[table];
      }
    }
  }
};
