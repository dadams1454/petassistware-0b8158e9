
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { WeightRecord } from '@/components/litters/puppies/weight/types';
import { calculatePercentChange } from '@/components/litters/puppies/weight/weightUnits';
import { useQuery } from '@tanstack/react-query';

export const useWeightTracker = (puppyId: string) => {
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch weight records for this puppy
  const { 
    data: weightRecords,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['weight-records', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as WeightRecord[];
    }
  });

  const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at' | 'percent_change'>) => {
    setIsSubmitting(true);
    try {
      // Calculate percent change if there are previous records
      let percentChange: number | null = null;
      
      if (weightRecords && weightRecords.length > 0) {
        const lastRecord = weightRecords[weightRecords.length - 1];
        
        // Only calculate if the units match
        if (lastRecord.weight_unit === record.weight_unit) {
          percentChange = calculatePercentChange(record.weight, lastRecord.weight);
        } else {
          // We'd need to convert units first, but for simplicity we'll skip in this implementation
          console.log('Units do not match, skipping percent change calculation');
        }
      }
      
      // Format date to string if it's a Date object
      let dateString = '';
      if (typeof record.date === 'string') {
        dateString = record.date;
      } else if (record.date) {
        // Check if it's a Date object
        const dateObj = record.date as unknown as Date;
        if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
          dateString = dateObj.toISOString().split('T')[0];
        }
      }
      
      // Insert new weight record - use dog_id: null when we're tracking a puppy
      // This accommodates the dual-purpose table that tracks both dogs and puppies
      const { data, error } = await supabase
        .from('weight_records')
        .insert({
          dog_id: null, // Use null for dog_id when tracking puppies
          puppy_id: puppyId,
          date: dateString,
          weight: record.weight,
          weight_unit: record.weight_unit,
          notes: record.notes,
          percent_change: percentChange
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Weight recorded",
        description: "The weight record has been saved successfully."
      });
      
      refetch();
      return data[0] as WeightRecord;
    } catch (error) {
      console.error('Error adding weight record:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the weight record.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteWeightRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      
      toast({
        title: "Weight record deleted",
        description: "The weight record has been deleted successfully."
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting weight record:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the weight record.",
        variant: "destructive"
      });
    }
  };

  return {
    weightRecords,
    isLoading,
    isAddingWeight,
    setIsAddingWeight,
    isSubmitting,
    addWeightRecord,
    deleteWeightRecord,
    refetchWeights: refetch
  };
};
