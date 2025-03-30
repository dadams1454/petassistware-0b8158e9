
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  getWeightHistory, 
  addWeightRecord as addRecord,
  deleteWeightRecord as deleteRecord
} from '@/services/healthService';
import { WeightRecord } from '@/types/health';

export const useWeightTracking = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch weight history
  const {
    data: weightHistory,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['weightHistory', dogId],
    queryFn: () => getWeightHistory(dogId),
    enabled: !!dogId
  });
  
  // Add a weight record
  const addWeightRecord = useMutation({
    mutationFn: (record: Omit<WeightRecord, 'id' | 'created_at'>) => 
      addRecord(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightHistory', dogId] });
      toast({
        title: 'Weight record added',
        description: 'The weight record has been successfully added',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add weight record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Delete a weight record
  const deleteWeightRecord = useMutation({
    mutationFn: (id: string) => deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightHistory', dogId] });
      toast({
        title: 'Weight record deleted',
        description: 'The weight record has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete weight record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Calculate weight trends
  const calculateGrowthRate = () => {
    if (!weightHistory || weightHistory.length < 2) return null;
    
    // Sort by date
    const sortedHistory = [...weightHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstRecord = sortedHistory[0];
    const lastRecord = sortedHistory[sortedHistory.length - 1];
    
    // Convert weights to the same unit (kg)
    const firstWeight = convertWeightToKg(firstRecord.weight, firstRecord.weight_unit);
    const lastWeight = convertWeightToKg(lastRecord.weight, lastRecord.weight_unit);
    
    // Calculate days between measurements
    const daysDiff = Math.max(1, Math.floor(
      (new Date(lastRecord.date).getTime() - new Date(firstRecord.date).getTime()) 
      / (1000 * 60 * 60 * 24)
    ));
    
    // Weight difference
    const weightDiff = lastWeight - firstWeight;
    
    // Calculate growth per day
    const growthPerDay = weightDiff / daysDiff;
    
    return {
      totalGain: weightDiff,
      daysTracked: daysDiff,
      growthPerDay,
      growthPerWeek: growthPerDay * 7,
      growthPerMonth: growthPerDay * 30,
      initialWeight: firstWeight,
      currentWeight: lastWeight,
      percentageGain: (weightDiff / firstWeight) * 100
    };
  };
  
  return {
    weightHistory,
    isLoading,
    error,
    refetch,
    addWeightRecord: addWeightRecord.mutate,
    deleteWeightRecord: deleteWeightRecord.mutate,
    isAdding: addWeightRecord.isPending,
    isDeleting: deleteWeightRecord.isPending,
    growthStats: calculateGrowthRate()
  };
};

// Helper function to convert weight to kg for calculations
const convertWeightToKg = (weight: number, unit: string): number => {
  switch (unit) {
    case 'kg':
      return weight;
    case 'lbs':
      return weight * 0.453592;
    case 'g':
      return weight / 1000;
    case 'oz':
      return weight * 0.0283495;
    default:
      return weight;
  }
};
