
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addDays, format, differenceInDays } from 'date-fns';
import { 
  ReproductiveStatus, 
  ReproductiveCycleData, 
  HeatCycle, 
  BreedingRecord, 
  PregnancyRecord, 
  ReproductiveMilestone,
  HeatStage,
  Dog
} from '@/types/reproductive';
import { toast } from 'sonner';

export const useReproductiveCycle = (dogId?: string) => {
  const queryClient = useQueryClient();
  
  const fetchDogData = async () => {
    if (!dogId) throw new Error('No dog ID provided');
    
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('id', dogId)
      .single();
      
    if (error) throw error;
    return data as Dog;
  };
  
  const fetchHeatCycles = async () => {
    if (!dogId) throw new Error('No dog ID provided');
    
    const { data, error } = await supabase
      .from('heat_cycles')
      .select('*')
      .eq('dog_id', dogId)
      .order('start_date', { ascending: false });
      
    if (error) throw error;
    return data as HeatCycle[];
  };
  
  const fetchBreedingRecords = async () => {
    if (!dogId) throw new Error('No dog ID provided');
    
    try {
      const { data: damBreedings, error: damError } = await supabase
        .from('breeding_records')
        .select('*, sire:sire_id(*)')
        .eq('dam_id', dogId)
        .order('breeding_date', { ascending: false });
        
      if (damError) throw damError;
      
      // Also check for breedings where this dog is the sire
      const { data: sireBreedings, error: sireError } = await supabase
        .from('breeding_records')
        .select('*, dam:dam_id(*)')
        .eq('sire_id', dogId)
        .order('breeding_date', { ascending: false });
        
      if (sireError) throw sireError;
      
      return [...(damBreedings || []), ...(sireBreedings || [])] as BreedingRecord[];
    } catch (error) {
      console.error('Error fetching breeding records:', error);
      return [] as BreedingRecord[];
    }
  };
  
  const fetchPregnancyRecords = async () => {
    if (!dogId) throw new Error('No dog ID provided');
    
    try {
      const { data, error } = await supabase
        .from('pregnancy_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as PregnancyRecord[];
    } catch (error) {
      console.error('Error fetching pregnancy records:', error);
      return [] as PregnancyRecord[];
    }
  };
  
  const fetchReproductiveMilestones = async () => {
    if (!dogId) throw new Error('No dog ID provided');
    
    try {
      const { data, error } = await supabase
        .from('reproductive_milestones')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      return data as ReproductiveMilestone[];
    } catch (error) {
      console.error('Error fetching reproductive milestones:', error);
      return [] as ReproductiveMilestone[];
    }
  };
  
  // Queries
  const dogQuery = useQuery({
    queryKey: ['reproductive-dog', dogId],
    queryFn: fetchDogData,
    enabled: !!dogId
  });
  
  const heatCyclesQuery = useQuery({
    queryKey: ['heat-cycles', dogId],
    queryFn: fetchHeatCycles,
    enabled: !!dogId
  });
  
  const breedingRecordsQuery = useQuery({
    queryKey: ['breeding-records', dogId],
    queryFn: fetchBreedingRecords,
    enabled: !!dogId
  });
  
  const pregnancyRecordsQuery = useQuery({
    queryKey: ['pregnancy-records', dogId],
    queryFn: fetchPregnancyRecords,
    enabled: !!dogId
  });
  
  const milestonesQuery = useQuery({
    queryKey: ['reproductive-milestones', dogId],
    queryFn: fetchReproductiveMilestones,
    enabled: !!dogId
  });
  
  // Process reproductive data
  const processReproductiveData = useCallback(() => {
    const dog = dogQuery.data;
    const heatCycles = heatCyclesQuery.data || [];
    const breedingRecords = breedingRecordsQuery.data || [];
    const pregnancyRecords = pregnancyRecordsQuery.data || [];
    const milestones = milestonesQuery.data || [];
    
    if (!dog) {
      return null;
    }
    
    // Determine status
    let status: ReproductiveStatus;
    let lastHeatDate: Date | undefined;
    let nextHeatDate: Date | undefined;
    let daysUntilNextHeat: number | undefined;
    let currentStage: HeatStage | undefined;
    let fertilityWindow: { start: Date; end: Date } | undefined;
    let gestationDays: number | undefined;
    let estimatedDueDate: Date | undefined;
    let averageCycleLength: number | undefined;
    
    // Calculate average cycle length
    if (heatCycles.length >= 2) {
      let totalDays = 0;
      let cycleCount = 0;
      
      for (let i = 0; i < heatCycles.length - 1; i++) {
        const currentCycle = new Date(heatCycles[i].start_date);
        const nextCycle = new Date(heatCycles[i + 1].start_date);
        const cycleDays = Math.abs(differenceInDays(currentCycle, nextCycle));
        
        if (cycleDays > 0 && cycleDays < 365) { // Sanity check
          totalDays += cycleDays;
          cycleCount++;
        }
      }
      
      if (cycleCount > 0) {
        averageCycleLength = Math.round(totalDays / cycleCount);
      } else {
        averageCycleLength = 180; // Default 6 months
      }
    } else {
      averageCycleLength = 180; // Default 6 months
    }
    
    // Default status
    status = ReproductiveStatus.Intact;
    
    // Check pregnancy
    if (dog.is_pregnant) {
      status = ReproductiveStatus.Pregnant;
      
      // Find breeding record
      if (dog.tie_date) {
        gestationDays = differenceInDays(new Date(), new Date(dog.tie_date));
        estimatedDueDate = addDays(new Date(dog.tie_date), 63); // 63 days gestation
      }
    } 
    // Check heat status
    else if (dog.gender === 'Female' && dog.last_heat_date) {
      lastHeatDate = new Date(dog.last_heat_date);
      const today = new Date();
      const daysInHeat = differenceInDays(today, lastHeatDate);
      
      if (daysInHeat <= 21) {
        // Currently in heat
        status = ReproductiveStatus.InHeat;
        
        // Determine current stage of heat
        if (daysInHeat <= 9) {
          currentStage = {
            id: 'proestrus',
            name: 'Proestrus',
            description: 'Swelling and bloody discharge, not receptive to males',
            day: daysInHeat,
            fertility: 'low',
            color: 'blue',
            length: 9
          };
        } else if (daysInHeat <= 13) {
          currentStage = {
            id: 'estrus',
            name: 'Estrus',
            description: 'Fertile period, receptive to males, lighter discharge',
            day: daysInHeat,
            fertility: 'peak',
            color: 'red',
            length: 4
          };
          
          // Set fertility window
          fertilityWindow = {
            start: addDays(lastHeatDate, 9),
            end: addDays(lastHeatDate, 13)
          };
        } else if (daysInHeat <= 15) {
          currentStage = {
            id: 'metestrus',
            name: 'Metestrus',
            description: 'End of fertility, hormone changes',
            day: daysInHeat,
            fertility: 'low',
            color: 'orange',
            length: 2
          };
        } else {
          currentStage = {
            id: 'diestrus',
            name: 'Diestrus',
            description: 'Post-heat recovery',
            day: daysInHeat,
            fertility: 'none',
            color: 'purple',
            length: 6
          };
        }
      } else {
        // Calculate next heat date
        nextHeatDate = addDays(lastHeatDate, averageCycleLength);
        daysUntilNextHeat = differenceInDays(nextHeatDate, today);
        
        // Check if in pre-heat (within 14 days of next heat)
        if (daysUntilNextHeat <= 14) {
          status = ReproductiveStatus.PreHeat;
        } else {
          status = ReproductiveStatus.Intact;
        }
      }
    }
    
    // Determine if currently in heat
    const isInHeat = status === ReproductiveStatus.InHeat;
    
    // Determine if in pre-heat phase
    const isPreHeat = status === ReproductiveStatus.PreHeat;
    
    // Determine if pregnant
    const isPregnant = status === ReproductiveStatus.Pregnant;
    
    // Current heat cycle (most recent)
    const currentHeatCycle = heatCycles.length > 0 ? heatCycles[0] : undefined;
    
    return {
      dog,
      heatCycles,
      breedingRecords,
      pregnancyRecords,
      milestones,
      status,
      lastHeatDate,
      nextHeatDate,
      daysUntilNextHeat,
      currentStage,
      isInHeat,
      isPreHeat,
      isPregnant,
      estimatedDueDate,
      showHeatCycles: true,
      showBreedingRecords: true,
      showPregnancyRecords: true,
      showMilestones: true,
      isLoading: false,
      isError: false,
      error: null,
      currentHeatCycle,
      averageCycleLength,
      fertilityWindow,
      gestationDays
    } as ReproductiveCycleData;
  }, [
    dogQuery.data,
    heatCyclesQuery.data,
    breedingRecordsQuery.data,
    pregnancyRecordsQuery.data,
    milestonesQuery.data
  ]);
  
  // Combined query result
  const processedData = dogQuery.data ? processReproductiveData() : null;
  const isLoading = dogQuery.isLoading || heatCyclesQuery.isLoading || breedingRecordsQuery.isLoading || pregnancyRecordsQuery.isLoading || milestonesQuery.isLoading;
  const isError = dogQuery.isError || heatCyclesQuery.isError || breedingRecordsQuery.isError || pregnancyRecordsQuery.isError || milestonesQuery.isError;
  const error = dogQuery.error || heatCyclesQuery.error || breedingRecordsQuery.error || pregnancyRecordsQuery.error || milestonesQuery.error;
  
  // Mutations
  const addHeatCycleMutation = useMutation({
    mutationFn: async (heatCycle: Partial<HeatCycle>) => {
      if (!dogId) throw new Error('No dog ID provided');
      
      const { data, error } = await supabase
        .from('heat_cycles')
        .insert({
          ...heatCycle,
          dog_id: dogId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the dog's last heat date
      await supabase
        .from('dogs')
        .update({ last_heat_date: heatCycle.start_date })
        .eq('id', dogId);
        
      return data as HeatCycle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heat-cycles', dogId] });
      queryClient.invalidateQueries({ queryKey: ['reproductive-dog', dogId] });
      toast.success('Heat cycle recorded successfully');
    },
    onError: (error) => {
      console.error('Error recording heat cycle:', error);
      toast.error('Failed to record heat cycle');
    }
  });
  
  const updateHeatCycleMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HeatCycle> & { id: string }) => {
      const { data, error } = await supabase
        .from('heat_cycles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data as HeatCycle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heat-cycles', dogId] });
      toast.success('Heat cycle updated successfully');
    },
    onError: (error) => {
      console.error('Error updating heat cycle:', error);
      toast.error('Failed to update heat cycle');
    }
  });
  
  const addBreedingRecordMutation = useMutation({
    mutationFn: async (record: Partial<BreedingRecord>) => {
      if (!dogId) throw new Error('No dog ID provided');
      
      // Ensure required fields are present
      const breedingRecord = {
        ...record,
        dam_id: dogId,
        breeding_date: record.breeding_date || format(new Date(), 'yyyy-MM-dd'),
        heat_cycle_id: record.heat_cycle_id,
        tie_date: record.tie_date,
        breeding_method: record.breeding_method,
        is_successful: record.is_successful,
        created_at: format(new Date(), 'yyyy-MM-dd')
      };
      
      const { data, error } = await supabase
        .from('breeding_records')
        .insert(breedingRecord)
        .select()
        .single();
        
      if (error) throw error;
      
      // If tie date is provided, update the dog's tie_date
      if (record.tie_date) {
        await supabase
          .from('dogs')
          .update({ tie_date: record.tie_date })
          .eq('id', dogId);
      }
      
      return data as BreedingRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeding-records', dogId] });
      queryClient.invalidateQueries({ queryKey: ['reproductive-dog', dogId] });
      toast.success('Breeding record added successfully');
    },
    onError: (error) => {
      console.error('Error adding breeding record:', error);
      toast.error('Failed to add breeding record');
    }
  });
  
  const updateBreedingRecordMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BreedingRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('breeding_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // If this is marking a breeding as successful and tie_date is provided,
      // update the dog's tie_date
      if (updates.is_successful === true && updates.tie_date && dogId) {
        await supabase
          .from('dogs')
          .update({ tie_date: updates.tie_date })
          .eq('id', dogId);
      }
      
      return data as BreedingRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeding-records', dogId] });
      queryClient.invalidateQueries({ queryKey: ['reproductive-dog', dogId] });
      toast.success('Breeding record updated successfully');
    },
    onError: (error) => {
      console.error('Error updating breeding record:', error);
      toast.error('Failed to update breeding record');
    }
  });
  
  const addPregnancyRecordMutation = useMutation({
    mutationFn: async (record: Partial<PregnancyRecord>) => {
      if (!dogId) throw new Error('No dog ID provided');
      
      // Ensure required fields are present
      const pregnancyRecord = {
        ...record,
        dog_id: dogId,
        confirmation_date: record.confirmation_date,
        estimated_whelp_date: record.estimated_whelp_date,
        status: 'confirmed',
        created_at: format(new Date(), 'yyyy-MM-dd')
      };
      
      const { data, error } = await supabase
        .from('pregnancy_records')
        .insert(pregnancyRecord)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the dog's pregnancy status
      await supabase
        .from('dogs')
        .update({ is_pregnant: true })
        .eq('id', dogId);
        
      return data as PregnancyRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pregnancy-records', dogId] });
      queryClient.invalidateQueries({ queryKey: ['reproductive-dog', dogId] });
      toast.success('Pregnancy confirmed successfully');
    },
    onError: (error) => {
      console.error('Error confirming pregnancy:', error);
      toast.error('Failed to confirm pregnancy');
    }
  });
  
  const updatePregnancyRecordMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PregnancyRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('pregnancy_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // If setting status to 'completed', update the dog's pregnancy status
      if (updates.status === 'completed' && dogId) {
        await supabase
          .from('dogs')
          .update({ 
            is_pregnant: false,
            tie_date: null,
            litter_number: supabase.rpc('increment', { row_id: dogId, table_name: 'dogs', column_name: 'litter_number' })
          })
          .eq('id', dogId);
      }
      
      return data as PregnancyRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pregnancy-records', dogId] });
      queryClient.invalidateQueries({ queryKey: ['reproductive-dog', dogId] });
      toast.success('Pregnancy record updated successfully');
    },
    onError: (error) => {
      console.error('Error updating pregnancy record:', error);
      toast.error('Failed to update pregnancy record');
    }
  });
  
  const addMilestoneMutation = useMutation({
    mutationFn: async (milestone: Partial<ReproductiveMilestone>) => {
      if (!dogId) throw new Error('No dog ID provided');
      
      // Ensure required fields are present
      const milestoneRecord = {
        ...milestone,
        dog_id: dogId,
        milestone_date: milestone.milestone_date || milestone.date,
        notes: milestone.notes,
        created_at: format(new Date(), 'yyyy-MM-dd')
      };
      
      const { data, error } = await supabase
        .from('reproductive_milestones')
        .insert(milestoneRecord)
        .select()
        .single();
        
      if (error) throw error;
      return data as ReproductiveMilestone;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reproductive-milestones', dogId] });
      toast.success('Milestone added successfully');
    },
    onError: (error) => {
      console.error('Error adding milestone:', error);
      toast.error('Failed to add milestone');
    }
  });
  
  return {
    data: processedData,
    isLoading,
    isError,
    error,
    refetch: () => {
      dogQuery.refetch();
      heatCyclesQuery.refetch();
      breedingRecordsQuery.refetch();
      pregnancyRecordsQuery.refetch();
      milestonesQuery.refetch();
    },
    
    // Mutations
    addHeatCycle: addHeatCycleMutation.mutate,
    updateHeatCycle: updateHeatCycleMutation.mutate,
    addBreedingRecord: addBreedingRecordMutation.mutate,
    updateBreedingRecord: updateBreedingRecordMutation.mutate,
    addPregnancyRecord: addPregnancyRecordMutation.mutate,
    updatePregnancyRecord: updatePregnancyRecordMutation.mutate,
    addMilestone: addMilestoneMutation.mutate
  };
};
