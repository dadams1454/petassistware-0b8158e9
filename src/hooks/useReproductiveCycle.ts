import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  HeatCycle, 
  BreedingRecord, 
  PregnancyRecord, 
  ReproductiveMilestone,
  ReproductiveStatus,
  HeatStage,
  ReproductiveCycleData
} from '@/types/reproductive';
import { Dog } from '@/types/dog';
import { 
  addDays, 
  differenceInDays, 
  format, 
  isBefore, 
  isAfter, 
  parseISO, 
  startOfDay
} from 'date-fns';

export const useReproductiveCycle = (dogId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch dog data
  const { 
    data: dog,
    isLoading: isDogLoading,
    error: dogError
  } = useQuery({
    queryKey: ['dog', dogId],
    queryFn: async () => {
      if (!dogId) return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
      
      if (error) throw error;
      return data as Dog;
    },
    enabled: !!dogId
  });
  
  // Fetch heat cycles
  const { 
    data: heatCycles = [],
    isLoading: isHeatCyclesLoading,
    error: heatCyclesError,
    refetch: refetchHeatCycles
  } = useQuery({
    queryKey: ['heat-cycles', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as HeatCycle[];
    },
    enabled: !!dogId
  });
  
  // Fetch breeding records
  const { 
    data: breedingRecords = [],
    isLoading: isBreedingLoading,
    error: breedingError,
    refetch: refetchBreeding
  } = useQuery({
    queryKey: ['breeding-records', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('breeding_records')
        .select(`
          *,
          sire:sire_id (
            id, name, breed, color, gender, photo_url
          )
        `)
        .eq('dog_id', dogId)
        .order('tie_date', { ascending: false });
      
      if (error) throw error;
      return data as BreedingRecord[];
    },
    enabled: !!dogId
  });
  
  // Fetch pregnancy records
  const { 
    data: pregnancyRecords = [],
    isLoading: isPregnancyLoading,
    error: pregnancyError,
    refetch: refetchPregnancy
  } = useQuery({
    queryKey: ['pregnancy-records', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('pregnancy_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PregnancyRecord[];
    },
    enabled: !!dogId
  });
  
  // Fetch reproductive milestones
  const { 
    data: milestones = [],
    isLoading: isMilestonesLoading,
    error: milestonesError,
    refetch: refetchMilestones
  } = useQuery({
    queryKey: ['reproductive-milestones', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('reproductive_milestones')
        .select('*')
        .eq('dog_id', dogId)
        .order('milestone_date', { ascending: false });
      
      if (error) throw error;
      return data as ReproductiveMilestone[];
    },
    enabled: !!dogId
  });
  
  // Calculate average cycle length based on past cycles
  const averageCycleLength = useMemo(() => {
    if (!heatCycles || heatCycles.length < 2) return null;
    
    let totalLength = 0;
    let validCycles = 0;
    
    // Calculate days between heat starts
    for (let i = 0; i < heatCycles.length - 1; i++) {
      const currentCycleStart = new Date(heatCycles[i].start_date);
      const nextCycleStart = new Date(heatCycles[i + 1].start_date);
      
      const daysBetween = differenceInDays(currentCycleStart, nextCycleStart);
      if (daysBetween > 0) {
        totalLength += daysBetween;
        validCycles++;
      }
    }
    
    // If we have valid cycles, calculate average
    if (validCycles > 0) {
      return Math.round(totalLength / validCycles);
    }
    
    // Otherwise, look for cycle_length values
    validCycles = 0;
    totalLength = 0;
    
    heatCycles.forEach(cycle => {
      if (cycle.cycle_length && cycle.cycle_length > 0) {
        totalLength += cycle.cycle_length;
        validCycles++;
      }
    });
    
    return validCycles > 0 ? Math.round(totalLength / validCycles) : null;
  }, [heatCycles]);
  
  // Calculate next expected heat date
  const nextHeatDate = useMemo(() => {
    if (!heatCycles || heatCycles.length === 0 || !dog) return null;
    
    // If the dog is in heat or pregnant, there is no next heat date yet
    if (dog.is_pregnant) return null;
    
    const lastHeatDate = dog.last_heat_date 
      ? new Date(dog.last_heat_date) 
      : heatCycles.length > 0 
        ? new Date(heatCycles[0].start_date)
        : null;
    
    if (!lastHeatDate) return null;
    
    // Use average cycle length if available, otherwise use typical cycle (6 months)
    const cycleInterval = averageCycleLength || 180; // Default to 6 months
    
    return addDays(lastHeatDate, cycleInterval);
  }, [dog, heatCycles, averageCycleLength]);
  
  // Calculate days until next heat
  const daysUntilNextHeat = useMemo(() => {
    if (!nextHeatDate) return null;
    return differenceInDays(nextHeatDate, new Date());
  }, [nextHeatDate]);
  
  // Determine reproductive status
  const reproductiveStatus = useMemo((): ReproductiveStatus => {
    if (!dog) return ReproductiveStatus.NOT_IN_HEAT;
    
    // Check if pregnant
    if (dog.is_pregnant) return ReproductiveStatus.PREGNANT;
    
    // Check if in heat
    if (dog.last_heat_date) {
      const lastHeatDate = new Date(dog.last_heat_date);
      const today = new Date();
      const daysSinceHeatStarted = differenceInDays(today, lastHeatDate);
      
      // Typical heat cycle lasts about 3 weeks
      if (daysSinceHeatStarted >= 0 && daysSinceHeatStarted <= 21) {
        return ReproductiveStatus.IN_HEAT;
      }
      
      // Check if in pre-heat (2 weeks before expected heat)
      if (nextHeatDate) {
        const preHeatStart = addDays(nextHeatDate, -14);
        if (isAfter(today, preHeatStart) && isBefore(today, nextHeatDate)) {
          return ReproductiveStatus.PRE_HEAT;
        }
      }
    }
    
    // Default
    return ReproductiveStatus.NOT_IN_HEAT;
  }, [dog, nextHeatDate]);
  
  // Calculate current heat day and stage if in heat
  const currentHeatInfo = useMemo(() => {
    if (!dog || reproductiveStatus !== ReproductiveStatus.IN_HEAT) {
      return { currentHeatDay: null, currentHeatStage: null, fertilityWindow: null };
    }
    
    const lastHeatDate = new Date(dog.last_heat_date!);
    const today = new Date();
    const currentHeatDay = differenceInDays(today, lastHeatDate) + 1;
    
    let currentHeatStage: HeatStage | null = null;
    
    // Define the heat stages
    if (currentHeatDay <= 3) {
      currentHeatStage = {
        name: 'Early Proestrus',
        description: 'Beginning of heat cycle, initial signs showing',
        day: currentHeatDay,
        fertility: 'low'
      };
    } else if (currentHeatDay <= 9) {
      currentHeatStage = {
        name: 'Proestrus',
        description: 'Visible swelling and bloody discharge, male attraction but not receptive yet',
        day: currentHeatDay,
        fertility: 'low'
      };
    } else if (currentHeatDay <= 14) {
      currentHeatStage = {
        name: 'Estrus',
        description: 'Female receptive to breeding, fertile period',
        day: currentHeatDay,
        fertility: currentHeatDay >= 11 && currentHeatDay <= 13 ? 'peak' : 'high'
      };
    } else if (currentHeatDay <= 21) {
      currentHeatStage = {
        name: 'Diestrus',
        description: 'Post-ovulation phase, no longer receptive',
        day: currentHeatDay,
        fertility: 'low'
      };
    } else {
      currentHeatStage = {
        name: 'Anestrus',
        description: 'Resting phase between heat cycles',
        day: currentHeatDay,
        fertility: 'low'
      };
    }
    
    // Calculate fertility window
    const fertilityWindow = {
      start: addDays(lastHeatDate, 9), // Day 10
      end: addDays(lastHeatDate, 14) // Day 15
    };
    
    return { currentHeatDay, currentHeatStage, fertilityWindow };
  }, [dog, reproductiveStatus]);
  
  // Get current pregnancy info
  const pregnancyInfo = useMemo(() => {
    if (!dog || !dog.is_pregnant || !dog.tie_date) {
      return { currentPregnancy: null, gestationDays: null, estimatedDueDate: null };
    }
    
    const currentPregnancy = pregnancyRecords.length > 0 ? pregnancyRecords[0] : null;
    const tieDate = new Date(dog.tie_date);
    const today = new Date();
    const gestationDays = differenceInDays(today, tieDate);
    
    // Standard gestation period is about 63 days
    const estimatedDueDate = addDays(tieDate, 63);
    
    return { currentPregnancy, gestationDays, estimatedDueDate };
  }, [dog, pregnancyRecords]);
  
  // Find the current heat cycle if in heat
  const currentHeatCycle = useMemo(() => {
    if (reproductiveStatus !== ReproductiveStatus.IN_HEAT || !heatCycles.length) {
      return null;
    }
    
    // Get the most recent heat cycle with no end date (ongoing)
    const ongoingCycle = heatCycles.find(cycle => !cycle.end_date);
    if (ongoingCycle) return ongoingCycle;
    
    // Or get the most recent heat cycle
    return heatCycles[0];
  }, [reproductiveStatus, heatCycles]);
  
  // Add a new heat cycle
  const addHeatCycle = useMutation({
    mutationFn: async (newCycle: Partial<HeatCycle>) => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const cycleData = {
        dog_id: dogId,
        start_date: newCycle.start_date,
        end_date: newCycle.end_date,
        symptoms: newCycle.symptoms,
        intensity: newCycle.intensity,
        notes: newCycle.notes,
        fertility_indicators: newCycle.fertility_indicators,
        cycle_number: newCycle.cycle_number || ((heatCycles?.length || 0) + 1)
      };
      
      const { data, error } = await supabase
        .from('heat_cycles')
        .insert(cycleData)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as HeatCycle;
    },
    onSuccess: () => {
      toast({
        title: 'Heat cycle recorded',
        description: 'Heat cycle has been successfully recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['heat-cycles', dogId] });
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to record heat cycle: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update a heat cycle
  const updateHeatCycle = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HeatCycle> }) => {
      const { error } = await supabase
        .from('heat_cycles')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      return { id, ...data };
    },
    onSuccess: () => {
      toast({
        title: 'Heat cycle updated',
        description: 'Heat cycle has been successfully updated',
      });
      queryClient.invalidateQueries({ queryKey: ['heat-cycles', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update heat cycle: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // End the current heat cycle
  const endHeatCycle = useMutation({
    mutationFn: async ({ id, endDate, notes }: { id: string; endDate: string; notes?: string }) => {
      const { error } = await supabase
        .from('heat_cycles')
        .update({
          end_date: endDate,
          notes: notes
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { id, end_date: endDate };
    },
    onSuccess: () => {
      toast({
        title: 'Heat cycle ended',
        description: 'Heat cycle has been marked as complete',
      });
      queryClient.invalidateQueries({ queryKey: ['heat-cycles', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to end heat cycle: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Add a breeding record
  const addBreedingRecord = useMutation({
    mutationFn: async (newBreeding: Partial<BreedingRecord>) => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const breedingData = {
        dog_id: dogId,
        sire_id: newBreeding.sire_id,
        heat_cycle_id: newBreeding.heat_cycle_id || currentHeatCycle?.id,
        tie_date: newBreeding.tie_date,
        breeding_method: newBreeding.breeding_method,
        is_successful: newBreeding.is_successful || null,
        notes: newBreeding.notes,
        estimated_due_date: newBreeding.tie_date 
          ? format(addDays(new Date(newBreeding.tie_date), 63), 'yyyy-MM-dd')
          : null
      };
      
      const { data, error } = await supabase
        .from('breeding_records')
        .insert(breedingData)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as BreedingRecord;
    },
    onSuccess: () => {
      toast({
        title: 'Breeding recorded',
        description: 'Breeding has been successfully recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['breeding-records', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to record breeding: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update a breeding record (mark as successful/unsuccessful)
  const updateBreedingRecord = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BreedingRecord> }) => {
      const { error } = await supabase
        .from('breeding_records')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      return { id, ...data };
    },
    onSuccess: () => {
      toast({
        title: 'Breeding record updated',
        description: 'Breeding record has been successfully updated',
      });
      queryClient.invalidateQueries({ queryKey: ['breeding-records', dogId] });
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update breeding record: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Add a pregnancy record
  const addPregnancyRecord = useMutation({
    mutationFn: async (newPregnancy: Partial<PregnancyRecord>) => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const pregnancyData = {
        dog_id: dogId,
        breeding_record_id: newPregnancy.breeding_record_id,
        confirmation_date: newPregnancy.confirmation_date,
        estimated_whelp_date: newPregnancy.estimated_whelp_date,
        notes: newPregnancy.notes
      };
      
      const { data, error } = await supabase
        .from('pregnancy_records')
        .insert(pregnancyData)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as PregnancyRecord;
    },
    onSuccess: () => {
      toast({
        title: 'Pregnancy recorded',
        description: 'Pregnancy has been successfully recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['pregnancy-records', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to record pregnancy: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update a pregnancy record
  const updatePregnancyRecord = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PregnancyRecord> }) => {
      const { error } = await supabase
        .from('pregnancy_records')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      return { id, ...data };
    },
    onSuccess: () => {
      toast({
        title: 'Pregnancy record updated',
        description: 'Pregnancy record has been successfully updated',
      });
      queryClient.invalidateQueries({ queryKey: ['pregnancy-records', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update pregnancy record: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Complete a pregnancy record (whelping)
  const completePregnancy = useMutation({
    mutationFn: async ({ 
      id, 
      actual_whelp_date, 
      puppies_born, 
      puppies_alive, 
      complications, 
      outcome, 
      notes 
    }: { 
      id: string; 
      actual_whelp_date: string; 
      puppies_born: number; 
      puppies_alive: number; 
      complications?: string; 
      outcome: string; 
      notes?: string; 
    }) => {
      const { error } = await supabase
        .from('pregnancy_records')
        .update({
          actual_whelp_date,
          puppies_born,
          puppies_alive,
          complications,
          outcome,
          notes
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update dog's pregnancy status
      await supabase
        .from('dogs')
        .update({ is_pregnant: false, tie_date: null })
        .eq('id', dogId);
      
      return { id, actual_whelp_date };
    },
    onSuccess: () => {
      toast({
        title: 'Whelping recorded',
        description: 'Whelping has been successfully recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['pregnancy-records', dogId] });
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to record whelping: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Add a reproductive milestone
  const addMilestone = useMutation({
    mutationFn: async (newMilestone: Partial<ReproductiveMilestone>) => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const milestoneData = {
        dog_id: dogId,
        milestone_type: newMilestone.milestone_type,
        milestone_date: newMilestone.milestone_date,
        notes: newMilestone.notes
      };
      
      const { data, error } = await supabase
        .from('reproductive_milestones')
        .insert(milestoneData)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as ReproductiveMilestone;
    },
    onSuccess: () => {
      toast({
        title: 'Milestone recorded',
        description: 'Reproductive milestone has been successfully recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['reproductive-milestones', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to record milestone: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Combine all data for easy consumption by components
  const reproductiveCycleData: ReproductiveCycleData | null = useMemo(() => {
    if (!dog) return null;
    
    return {
      dog,
      heatCycles,
      breedingRecords,
      pregnancyRecords,
      milestones,
      status: reproductiveStatus,
      nextHeatDate: nextHeatDate,
      daysUntilNextHeat,
      averageCycleLength,
      currentHeatCycle,
      currentHeatDay: currentHeatInfo.currentHeatDay,
      currentHeatStage: currentHeatInfo.currentHeatStage,
      fertilityWindow: currentHeatInfo.fertilityWindow,
      currentPregnancy: pregnancyInfo.currentPregnancy,
      gestationDays: pregnancyInfo.gestationDays,
      estimatedDueDate: pregnancyInfo.estimatedDueDate,
    };
  }, [
    dog,
    heatCycles,
    breedingRecords,
    pregnancyRecords,
    milestones,
    reproductiveStatus,
    nextHeatDate,
    daysUntilNextHeat,
    averageCycleLength,
    currentHeatCycle,
    currentHeatInfo,
    pregnancyInfo
  ]);
  
  // Combine loading states
  const isLoading = isDogLoading || isHeatCyclesLoading || isBreedingLoading || isPregnancyLoading || isMilestonesLoading;
  
  // Combine errors
  const error = dogError || heatCyclesError || breedingError || pregnancyError || milestonesError;
  
  // Function to refresh all data
  const refetchAll = () => {
    refetchHeatCycles();
    refetchBreeding();
    refetchPregnancy();
    refetchMilestones();
    queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
  };
  
  return {
    // Data
    data: reproductiveCycleData,
    isLoading,
    error,
    refetch: refetchAll,
    
    // Heat cycle functions
    addHeatCycle: addHeatCycle.mutateAsync,
    updateHeatCycle: updateHeatCycle.mutateAsync,
    endHeatCycle: endHeatCycle.mutateAsync,
    
    // Breeding functions
    addBreedingRecord: addBreedingRecord.mutateAsync,
    updateBreedingRecord: updateBreedingRecord.mutateAsync,
    
    // Pregnancy functions
    addPregnancyRecord: addPregnancyRecord.mutateAsync,
    updatePregnancyRecord: updatePregnancyRecord.mutateAsync,
    completePregnancy: completePregnancy.mutateAsync,
    
    // Milestone functions
    addMilestone: addMilestone.mutateAsync,
    
    // Loading states
    isAddingHeatCycle: addHeatCycle.isPending,
    isUpdatingHeatCycle: updateHeatCycle.isPending,
    isEndingHeatCycle: endHeatCycle.isPending,
    isAddingBreeding: addBreedingRecord.isPending,
    isUpdatingBreeding: updateBreedingRecord.isPending,
    isAddingPregnancy: addPregnancyRecord.isPending,
    isUpdatingPregnancy: updatePregnancyRecord.isPending,
    isCompletingPregnancy: completePregnancy.isPending,
    isAddingMilestone: addMilestone.isPending
  };
};
