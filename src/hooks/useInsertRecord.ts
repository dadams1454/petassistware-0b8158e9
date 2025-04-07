
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { WeightUnit, standardizeWeightUnit } from '@/types/common';

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
        const validatedPayload = validateAndPreparePayload(tableName, payload);

        // Type assertion needed since we can't predict exact table structure
        // This is a simplification to make TypeScript happy
        const { data, error: insertError } = await supabase
          .from(tableName)
          .insert(validatedPayload as any)
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

  // Helper function to validate and prepare payload based on table name
  const validateAndPreparePayload = (table: string, payload: Partial<T>): Partial<T> => {
    const modifiedPayload = { ...payload };
    const missingFields: string[] = [];

    switch (table) {
      case 'weight_records':
      case 'puppy_weights':
        if (!payload.dog_id && !payload.puppy_id) missingFields.push('dog_id or puppy_id');
        if (!payload.weight) missingFields.push('weight');
        if (!payload.weight_unit) missingFields.push('weight_unit');
        if (!payload.date) missingFields.push('date');
        
        // Ensure weight_unit is correctly standardized if present
        if (payload.weight_unit && typeof payload.weight_unit === 'string') {
          modifiedPayload.weight_unit = standardizeWeightUnit(payload.weight_unit);
        }
        
        // If dog_id is missing but we have puppy_id, use a dummy dog_id 
        // (this is a workaround for some Supabase tables that require dog_id but you only have puppy_id)
        if (!payload.dog_id && payload.puppy_id) {
          console.log('Adding default dog_id for puppy weight record');
          modifiedPayload.dog_id = '00000000-0000-0000-0000-000000000000';
        }
        break;
      
      case 'health_records':
        if (!payload.dog_id) missingFields.push('dog_id');
        if (!payload.record_type) missingFields.push('record_type');
        if (!payload.visit_date && !payload.date) {
          missingFields.push('visit_date');
        } else if (payload.date && !payload.visit_date) {
          // Copy date to visit_date if only date is provided
          modifiedPayload.visit_date = payload.date;
        }
        if (!payload.vet_name) missingFields.push('vet_name');
        break;
      
      case 'breeding_records':
        if (!payload.sire_id) missingFields.push('sire_id');
        if (!payload.breeding_date && payload.tie_date) {
          // Use tie_date as breeding_date if only tie_date is provided
          modifiedPayload.breeding_date = payload.tie_date;
        } else if (!payload.breeding_date) {
          missingFields.push('breeding_date');
        }
        if (!payload.dog_id && !payload.dam_id) missingFields.push('dog_id or dam_id');
        
        // If dog_id is missing but we have dam_id, use dam_id as dog_id
        if (!payload.dog_id && payload.dam_id) {
          modifiedPayload.dog_id = payload.dam_id;
        }
        
        // Copy method to breeding_method if only method is provided
        if (payload.method && !payload.breeding_method) {
          modifiedPayload.breeding_method = payload.method;
        }
        // Copy breeding_method to method if only breeding_method is provided
        if (payload.breeding_method && !payload.method) {
          modifiedPayload.method = payload.breeding_method;
        }
        break;
      
      case 'welping_observations':
        if (!payload.welping_record_id) missingFields.push('welping_record_id');
        if (!payload.observation_type) missingFields.push('observation_type');
        if (!payload.observation_time) missingFields.push('observation_time');
        if (!payload.description) missingFields.push('description');
        break;

      // Add more table validations as needed
      case 'heat_cycles':
        if (!payload.dog_id) missingFields.push('dog_id');
        if (!payload.start_date) missingFields.push('start_date');
        if (payload.intensity && typeof payload.intensity === 'string') {
          // Make sure intensity is one of the allowed values
          const validIntensities = ['light', 'moderate', 'heavy', 'mild', 'medium', 'low', 'high', 'peak', 'strong', 'unknown'];
          if (!validIntensities.includes(payload.intensity)) {
            modifiedPayload.intensity = 'unknown';
          }
        }
        break;
        
      case 'litters':
        if (!payload.birth_date) missingFields.push('birth_date');
        if (!payload.breeder_id) {
          missingFields.push('breeder_id');
          // Use a default breeder_id if not provided 
          modifiedPayload.breeder_id = '00000000-0000-0000-0000-000000000000';
        }
        if (!payload.status) {
          // Set a default status if not provided
          modifiedPayload.status = 'active';
        }
        break;
        
      case 'pregnancy_records':
        if (!payload.dog_id) missingFields.push('dog_id');
        if (!payload.status) {
          // Set a default status if not provided
          modifiedPayload.status = 'pending';
        }
        break;
        
      case 'reproductive_milestones':
        if (!payload.dog_id) missingFields.push('dog_id');
        if (!payload.milestone_type) missingFields.push('milestone_type');
        if (!payload.milestone_date) missingFields.push('milestone_date');
        break;
        
      case 'socialization_records':
        if (!payload.puppy_id) missingFields.push('puppy_id');
        if (!payload.category) missingFields.push('category');
        if (!payload.experience) missingFields.push('experience');
        if (!payload.experience_date) missingFields.push('experience_date');
        break;
    }

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields for ${table}: ${missingFields.join(', ')}`);
    }

    return modifiedPayload;
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
