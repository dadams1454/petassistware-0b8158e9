
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import { HeatCycle, HeatIntensity } from '@/types/reproductive';

// Helper to ensure intensity is a valid HeatIntensity value
const validateHeatIntensity = (intensity: string | null): HeatIntensity => {
  if (intensity === 'mild' || intensity === 'moderate' || intensity === 'strong' || intensity === 'unknown') {
    return intensity as HeatIntensity;
  }
  return 'moderate'; // Default fallback
};

export const useHeatCycles = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch heat cycles
  const { 
    data: heatCycles, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['heat-cycles', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false });
        
      if (error) throw error;

      // Transform data to ensure it matches HeatCycle type
      return (data || []).map(cycle => ({
        ...cycle,
        intensity: validateHeatIntensity(cycle.intensity)
      })) as HeatCycle[];
    },
    enabled: !!dogId
  });
  
  // Calculate average cycle length
  const averageCycleLength = (() => {
    if (!heatCycles || heatCycles.length < 2) return null;
    
    let totalLength = 0;
    let validCycles = 0;
    
    // If we have consecutive cycles, calculate the time between start dates
    for (let i = 0; i < heatCycles.length - 1; i++) {
      const currentStart = new Date(heatCycles[i].start_date);
      const nextStart = new Date(heatCycles[i + 1].start_date);
      
      const daysBetween = differenceInDays(currentStart, nextStart);
      if (daysBetween > 0) {
        totalLength += daysBetween;
        validCycles++;
      }
    }
    
    if (validCycles === 0) {
      // Alternatively, use cycle_length if available
      heatCycles.forEach(cycle => {
        if (cycle.cycle_length) {
          totalLength += cycle.cycle_length;
          validCycles++;
        }
      });
    }
    
    return validCycles > 0 ? Math.round(totalLength / validCycles) : null;
  })();
  
  // Add heat cycle
  const addHeatCycle = useMutation({
    mutationFn: async (cycleData: Partial<HeatCycle>) => {
      // Ensure intensity is a valid HeatIntensity value
      const intensityValue = validateHeatIntensity(cycleData.intensity || null);
      
      const { data, error } = await supabase
        .from('heat_cycles')
        .insert({
          dog_id: dogId,
          start_date: cycleData.start_date,
          end_date: cycleData.end_date,
          notes: cycleData.notes,
          symptoms: cycleData.symptoms,
          intensity: intensityValue,
          cycle_number: cycleData.cycle_number || (heatCycles ? heatCycles.length + 1 : 1)
        })
        .select();
        
      if (error) throw error;
      
      // Also update the dog's last heat date
      await supabase
        .from('dogs')
        .update({ last_heat_date: cycleData.start_date })
        .eq('id', dogId);
      
      return data[0] as HeatCycle;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Heat cycle recorded successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['heat-cycles', dogId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save heat cycle: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Update heat cycle
  const updateHeatCycle = useMutation({
    mutationFn: async (updates: { id: string, data: Partial<HeatCycle> }) => {
      const { id, data: cycleData } = updates;
      
      // Ensure intensity is a valid HeatIntensity value
      const intensityValue = validateHeatIntensity(cycleData.intensity || null);
      
      const { data, error } = await supabase
        .from('heat_cycles')
        .update({
          end_date: cycleData.end_date,
          notes: cycleData.notes,
          symptoms: cycleData.symptoms,
          intensity: intensityValue,
          cycle_length: cycleData.end_date && cycleData.start_date
            ? differenceInDays(new Date(cycleData.end_date), new Date(cycleData.start_date)) 
            : null
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0] as HeatCycle;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Heat cycle updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['heat-cycles', dogId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update heat cycle: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    heatCycles,
    isLoading,
    error,
    averageCycleLength,
    addHeatCycle: addHeatCycle.mutateAsync,
    updateHeatCycle: updateHeatCycle.mutateAsync
  };
};
