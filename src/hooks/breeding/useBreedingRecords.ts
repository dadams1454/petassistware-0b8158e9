
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BreedingRecord } from '@/types/reproductive';

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
        // First try the new breeding_records table
        const { data: newData, error: newError } = await supabase
          .from('breeding_records')
          .select(`
            *,
            sire:sire_id(*)
          `)
          .eq('dog_id', dogId)
          .order('breeding_date', { ascending: false });
          
        if (newError) {
          console.error('Error fetching from breeding_records:', newError);
          
          // Fall back to the old table schema
          const { data: oldData, error: oldError } = await supabase
            .from('breeding_records') // or whatever the old table was
            .select(`*`)
            .eq('dam_id', dogId)
            .order('breeding_date', { ascending: false });
            
          if (oldError) {
            console.error('Error fetching breeding records from old table:', oldError);
            return [];
          }
          
          return oldData || [];
        }
        
        return newData;
      } catch (err) {
        console.error('Exception in fetching breeding records:', err);
        return [];
      }
    },
    enabled: !!dogId
  });

  // Add breeding record mutation
  const addBreedingRecord = useMutation({
    mutationFn: async (record: Omit<BreedingRecord, 'id' | 'created_at'>) => {
      try {
        // Prepare the record for the new schema
        const newRecord = {
          dog_id: record.dam_id, // dam_id becomes dog_id in new schema
          sire_id: record.sire_id,
          breeding_date: record.breeding_date,
          method: record.breeding_method, // field name change
          notes: record.notes
        };
        
        const { data, error } = await supabase
          .from('breeding_records')
          .insert(newRecord)
          .select()
          .single();
          
        if (error) throw error;
        return data;
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
    breedingRecords,
    isLoading,
    error,
    addBreedingRecord: addBreedingRecord.mutateAsync,
    deleteBreedingRecord: deleteBreedingRecord.mutateAsync
  };
};
