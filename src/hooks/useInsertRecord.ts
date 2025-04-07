
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

/**
 * Hook for inserting records into Supabase tables with error handling
 * @param tableName The name of the table to insert records into
 * @param queryKey The query key to invalidate after successful insertion
 * @returns An object with mutation functions and state
 */
export function useInsertRecord<T extends Record<string, any>>(
  tableName: string,
  queryKey: string | string[]
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create mutation function
  const mutation = useMutation({
    mutationFn: async (payload: Partial<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Inserting record into ${tableName}:`, payload);

        // Make sure the required fields are present based on common tables
        validateRequiredFields(tableName, payload);

        // Type assertion needed since we can't predict exact table structure
        // This is a simplification to make TypeScript happy
        const { data, error: insertError } = await supabase
          .from(tableName)
          .insert(payload as any)
          .select();

        if (insertError) {
          console.error(`Error inserting into ${tableName}:`, insertError);
          throw new Error(insertError.message);
        }

        console.log(`Successfully inserted record into ${tableName}:`, data);
        return (data as any)[0] as T;
      } catch (err: any) {
        setError(err);
        console.error(`Failed to insert record into ${tableName}:`, err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
      
      // Show success toast
      toast({
        title: 'Record created successfully',
        description: `The record was successfully added to ${tableName}.`,
        variant: 'default',
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: 'Failed to create record',
        description: error.message || `There was an error adding the record to ${tableName}.`,
        variant: 'destructive',
      });
    }
  });

  // Helper function to validate commonly required fields based on table name
  const validateRequiredFields = (table: string, payload: Partial<T>): void => {
    const missingFields: string[] = [];

    switch (table) {
      case 'weight_records':
      case 'puppy_weights':
        if (!payload.dog_id && !payload.puppy_id) missingFields.push('dog_id or puppy_id');
        if (!payload.weight) missingFields.push('weight');
        if (!payload.weight_unit) missingFields.push('weight_unit');
        if (!payload.date) missingFields.push('date');
        break;
      
      case 'health_records':
        if (!payload.dog_id) missingFields.push('dog_id');
        if (!payload.record_type) missingFields.push('record_type');
        if (!payload.visit_date) missingFields.push('visit_date');
        if (!payload.vet_name) missingFields.push('vet_name');
        break;
      
      case 'breeding_records':
        if (!payload.sire_id) missingFields.push('sire_id');
        if (!payload.breeding_date) missingFields.push('breeding_date');
        if (!payload.dog_id && !payload.dam_id) missingFields.push('dog_id or dam_id');
        break;
      
      case 'welping_observations':
        if (!payload.welping_record_id) missingFields.push('welping_record_id');
        if (!payload.observation_type) missingFields.push('observation_type');
        if (!payload.observation_time) missingFields.push('observation_time');
        if (!payload.description) missingFields.push('description');
        break;

      // Add more table validations as needed
    }

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields for ${table}: ${missingFields.join(', ')}`);
    }
  };

  /**
   * Insert a record with success callback
   * @param payload The data to insert
   * @param onSuccess Optional callback on success
   */
  const insertRecord = async (
    payload: Partial<T>,
    onSuccess?: (data: T) => void
  ): Promise<T> => {
    try {
      const result = await mutation.mutateAsync(payload);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      console.error('Insert operation failed:', err);
      throw err;
    }
  };

  return {
    insertRecord,
    isInserting: isLoading || mutation.isPending,
    error: error || mutation.error,
    reset: mutation.reset
  };
}

export default useInsertRecord;
