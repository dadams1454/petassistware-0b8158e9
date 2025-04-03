
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BreedingRecord, normalizeBreedingRecord } from '@/types/reproductive';

export const useBreedingRecords = (dogId: string) => {
  const queryClient = useQueryClient();

  // Fetch breeding records
  const { 
    data: breedingRecords,
    isLoading,
    error
  } = useQuery({
    queryKey: ['breedingRecords', dogId],
    queryFn: async () => {
      try {
        // First try to fetch as dam_id (new schema)
        const { data: damRecords, error: damError } = await supabase
          .from('breeding_records')
          .select(`
            *,
            sire:sire_id(*)
          `)
          .eq('dam_id', dogId)
          .order('breeding_date', { ascending: false });
          
        if (damError && damError.message.includes('column "dam_id" does not exist')) {
          console.log('Falling back to dog_id schema');
          
          // Fall back to dog_id schema
          const { data: dogRecords, error: dogError } = await supabase
            .from('breeding_records')
            .select(`
              *,
              sire:sire_id(*)
            `)
            .eq('dog_id', dogId)
            .order('breeding_date', { ascending: false });
            
          if (dogError) {
            console.error('Error fetching breeding records with dog_id:', dogError);
            return [];
          }
          
          // Normalize records to ensure consistent structure
          return (dogRecords || []).map(record => normalizeBreedingRecord(record));
        }
        
        // Normalize dam_id records
        return (damRecords || []).map(record => normalizeBreedingRecord(record));
      } catch (err) {
        console.error('Exception in fetching breeding records:', err);
        return [];
      }
    },
    enabled: !!dogId
  });

  // Add breeding record mutation
  const addBreedingRecord = useMutation({
    mutationFn: async (record: any) => {
      try {
        // Determine whether to use dam_id or dog_id based on schema detection
        const { data: schemaCheck, error: schemaError } = await supabase
          .from('breeding_records')
          .select('dam_id')
          .limit(1);
        
        // Check if dam_id exists in the schema
        const usesDamId = !schemaError || !schemaError.message.includes('column "dam_id" does not exist');
        
        // Prepare the record based on schema
        const newRecord = usesDamId 
          ? {
              dam_id: record.dam_id,
              sire_id: record.sire_id,
              breeding_date: record.breeding_date,
              tie_date: record.tie_date,
              method: record.method || record.breeding_method,
              success: record.success || record.is_successful,
              notes: record.notes
            }
          : {
              dog_id: record.dam_id, // Use dam_id as dog_id
              sire_id: record.sire_id,
              breeding_date: record.breeding_date,
              tie_date: record.tie_date,
              method: record.method || record.breeding_method,
              success: record.success || record.is_successful,
              notes: record.notes
            };
        
        const { data, error } = await supabase
          .from('breeding_records')
          .insert(newRecord)
          .select()
          .single();
          
        if (error) throw error;
        return normalizeBreedingRecord(data);
      } catch (err) {
        console.error('Error adding breeding record:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breedingRecords', dogId] });
    }
  });

  // Delete breeding record mutation
  const deleteBreedingRecord = useMutation({
    mutationFn: async (recordId: string) => {
      try {
        const { error } = await supabase
          .from('breeding_records')
          .delete()
          .eq('id', recordId);
          
        if (error) throw error;
        return recordId;
      } catch (err) {
        console.error('Error deleting breeding record:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breedingRecords', dogId] });
    }
  });

  return {
    breedingRecords: breedingRecords || [],
    isLoading,
    error,
    addBreedingRecord: addBreedingRecord.mutateAsync,
    deleteBreedingRecord: deleteBreedingRecord.mutateAsync
  };
};
