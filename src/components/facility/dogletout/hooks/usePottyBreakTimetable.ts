
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DogCareStatus } from '@/types/dailyCare';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { checkDogsIncompatibility } from '@/services/dailyCare/dogIncompatibilitiesService';

export interface PottyBreakEntry {
  timeSlot: string;
  timestamp: string;
  status: 'out' | 'in';
  notes?: string;
}

export const usePottyBreakTimetable = (
  dogsData: DogCareStatus[],
  date: Date
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, PottyBreakEntry[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [incompatibilityWarning, setIncompatibilityWarning] = useState<{
    dogId: string;
    dogName: string;
    incompatibleDogs: Array<{id: string, name: string}>;
  } | null>(null);
  
  // Format date for our API calls
  const formattedDate = useMemo(() => {
    return date.toISOString().split('T')[0];
  }, [date]);
  
  // Fetch potty breaks for all dogs for the selected date
  const fetchPottyBreaks = useCallback(async () => {
    setIsLoading(true);
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Fetch all potty breaks for the day
      const { data, error } = await supabase
        .from('potty_break_sessions')
        .select(`
          *,
          dogs:potty_break_dogs(dog_id)
        `)
        .gte('session_time', startOfDay.toISOString())
        .lte('session_time', endOfDay.toISOString());
      
      if (error) throw error;
      
      // Transform the data into our desired format
      const breaksByDog: Record<string, PottyBreakEntry[]> = {};
      
      // Process each session
      data?.forEach(session => {
        // Extract the time slot
        const sessionTime = new Date(session.session_time);
        let hour = sessionTime.getHours();
        const formattedHour = hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? 'PM' : 'AM';
        const timeSlot = `${formattedHour}:00 ${amPm}`;
        
        // Get the status from the notes
        const isOut = session.notes?.includes('out') || !session.notes?.includes('in');
        const status = isOut ? 'out' : 'in';
        
        // For each dog in this session
        session.dogs?.forEach((dogEntry: any) => {
          const dogId = dogEntry.dog_id;
          
          if (!breaksByDog[dogId]) {
            breaksByDog[dogId] = [];
          }
          
          // Add entry for this dog
          breaksByDog[dogId].push({
            timeSlot,
            timestamp: session.session_time,
            status,
            notes: session.notes
          });
        });
      });
      
      setPottyBreaks(breaksByDog);
    } catch (error) {
      console.error('Error fetching potty breaks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load potty break data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [date, toast]);
  
  // Check if a dog has a potty break at a specific time slot
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string) => {
    return pottyBreaks[dogId]?.some(entry => entry.timeSlot === timeSlot) ?? false;
  }, [pottyBreaks]);
  
  // Get the potty break status for a dog at a specific time slot
  const getPottyBreakStatus = useCallback((dogId: string, timeSlot: string) => {
    const entry = pottyBreaks[dogId]?.find(entry => entry.timeSlot === timeSlot);
    return entry ? entry.status : null;
  }, [pottyBreaks]);
  
  // Check if any dog is incompatible with dogs currently outside
  const checkIncompatibilities = useCallback(async (dogId: string, dogName: string) => {
    // Get all dogs that are currently outside (have 'out' status)
    const dogsOutside = Object.entries(pottyBreaks)
      .filter(([id, breaks]) => {
        // Only check other dogs, not this one
        if (id === dogId) return false;
        return breaks.some(entry => entry.status === 'out');
      })
      .map(([id]) => id);
    
    if (dogsOutside.length === 0) return null;
    
    // Check for incompatibilities
    const incompatibleDogs = [];
    for (const outsideDogId of dogsOutside) {
      const isIncompatible = await checkDogsIncompatibility(dogId, outsideDogId);
      if (isIncompatible) {
        const outsideDog = dogsData.find(d => d.dog_id === outsideDogId);
        if (outsideDog) {
          incompatibleDogs.push({
            id: outsideDogId,
            name: outsideDog.dog_name
          });
        }
      }
    }
    
    return incompatibleDogs.length > 0 ? {
      dogId,
      dogName,
      incompatibleDogs
    } : null;
  }, [pottyBreaks, dogsData]);
  
  // Handle a cell click to toggle potty break state
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string) => {
    try {
      const currentStatus = getPottyBreakStatus(dogId, timeSlot);
      
      // Parse the time slot to get the hour
      const [hourPart, amPm] = timeSlot.split(' ');
      const [hourStr] = hourPart.split(':');
      let hour = parseInt(hourStr);
      if (amPm === 'PM' && hour < 12) hour += 12;
      if (amPm === 'AM' && hour === 12) hour = 0;
      
      // Create a timestamp for the selected time slot
      const timestamp = new Date(date);
      timestamp.setHours(hour, 0, 0, 0);
      
      if (currentStatus === 'out') {
        // Change from "out" to "in"
        await supabase.from('potty_break_sessions').insert({
          notes: `Dog ${dogName} came in at ${timeSlot}`,
          session_time: timestamp.toISOString(),
          created_by: user?.id
        }).select().single().then(async ({ data }) => {
          if (data) {
            // Add the dog to the session
            await supabase.from('potty_break_dogs').insert({
              session_id: data.id,
              dog_id: dogId
            });
            
            // Optimistic update
            setPottyBreaks(prev => {
              const updatedDogBreaks = [...(prev[dogId] || [])];
              // Remove any previous entry for this time slot
              const filteredBreaks = updatedDogBreaks.filter(entry => entry.timeSlot !== timeSlot);
              
              // Add the new entry
              return {
                ...prev,
                [dogId]: [
                  ...filteredBreaks,
                  {
                    timeSlot,
                    timestamp: timestamp.toISOString(),
                    status: 'in',
                    notes: `Dog ${dogName} came in at ${timeSlot}`
                  }
                ]
              };
            });
            
            toast({
              title: 'Dog returned',
              description: `${dogName} was marked as returned at ${timeSlot}`
            });
          }
        });
      } else if (currentStatus === 'in') {
        // If already marked as "in", remove the entry (toggle off)
        // We need to find the session ID for this dog and time slot
        const entry = pottyBreaks[dogId]?.find(entry => entry.timeSlot === timeSlot && entry.status === 'in');
        
        if (entry) {
          // First try to find the session in the database
          const { data: sessionData } = await supabase
            .from('potty_break_sessions')
            .select('id')
            .eq('session_time', entry.timestamp)
            .single();
          
          if (sessionData?.id) {
            // First remove the dog from the session
            await supabase
              .from('potty_break_dogs')
              .delete()
              .eq('session_id', sessionData.id)
              .eq('dog_id', dogId);
            
            // Then remove the session if it has no more dogs
            const { count } = await supabase
              .from('potty_break_dogs')
              .select('*', { count: 'exact' })
              .eq('session_id', sessionData.id);
            
            if (count === 0) {
              await supabase
                .from('potty_break_sessions')
                .delete()
                .eq('id', sessionData.id);
            }
          }
          
          // Optimistic update
          setPottyBreaks(prev => {
            const updatedDogBreaks = [...(prev[dogId] || [])];
            const filteredBreaks = updatedDogBreaks.filter(entry => entry.timeSlot !== timeSlot);
            
            if (filteredBreaks.length === 0) {
              const newState = { ...prev };
              delete newState[dogId];
              return newState;
            }
            
            return {
              ...prev,
              [dogId]: filteredBreaks
            };
          });
          
          toast({
            title: 'Entry removed',
            description: `Potty break entry for ${dogName} at ${timeSlot} has been removed`
          });
        }
      } else {
        // No current entry - check incompatibilities before marking dog as "out"
        const incompatibilities = await checkIncompatibilities(dogId, dogName);
        
        if (incompatibilities && incompatibilities.incompatibleDogs.length > 0) {
          // Set the incompatibility warning, but don't proceed with the potty break
          setIncompatibilityWarning(incompatibilities);
          return;
        }
        
        // No incompatibilities, or user chooses to proceed - mark dog as "out"
        await supabase.from('potty_break_sessions').insert({
          notes: `Dog ${dogName} went out at ${timeSlot}`,
          session_time: timestamp.toISOString(),
          created_by: user?.id
        }).select().single().then(async ({ data }) => {
          if (data) {
            // Add the dog to the session
            await supabase.from('potty_break_dogs').insert({
              session_id: data.id,
              dog_id: dogId
            });
            
            // Optimistic update
            setPottyBreaks(prev => ({
              ...prev,
              [dogId]: [
                ...(prev[dogId] || []),
                {
                  timeSlot,
                  timestamp: timestamp.toISOString(),
                  status: 'out',
                  notes: `Dog ${dogName} went out at ${timeSlot}`
                }
              ]
            }));
            
            toast({
              title: 'Dog let out',
              description: `${dogName} was marked as out at ${timeSlot}`
            });
          }
        });
      }
    } catch (error) {
      console.error('Error updating potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to update potty break data',
        variant: 'destructive'
      });
    }
  }, [pottyBreaks, getPottyBreakStatus, date, toast, user?.id, checkIncompatibilities]);
  
  // Check if a dog is currently outside
  const isDogOutside = useCallback((dogId: string) => {
    return (pottyBreaks[dogId] || []).some(entry => entry.status === 'out');
  }, [pottyBreaks]);
  
  // Get time since dog was let out (for outside dogs)
  const getOutsideTime = useCallback((dogId: string) => {
    const now = new Date();
    const dogBreaks = pottyBreaks[dogId] || [];
    
    const latestBreak = dogBreaks
      .filter(brk => brk.status === 'out')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (!latestBreak) return null;
    
    const outTime = new Date(latestBreak.timestamp);
    const diffMs = now.getTime() - outTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  }, [pottyBreaks]);
  
  // Clear incompatibility warning
  const clearIncompatibilityWarning = useCallback(() => {
    setIncompatibilityWarning(null);
  }, []);
  
  // Handle group potty break
  const handleGroupPottyBreak = useCallback(async (groupId: string, timeSlot: string, status: 'out' | 'in') => {
    try {
      // Parse the time slot to get the hour
      const [hourPart, amPm] = timeSlot.split(' ');
      const [hourStr] = hourPart.split(':');
      let hour = parseInt(hourStr);
      if (amPm === 'PM' && hour < 12) hour += 12;
      if (amPm === 'AM' && hour === 12) hour = 0;
      
      // Create a timestamp for the selected time slot
      const timestamp = new Date(date);
      timestamp.setHours(hour, 0, 0, 0);
      
      // Get dogs in the group
      const { data: groupData, error: groupError } = await supabase
        .from('dog_group_members')
        .select('dog_id')
        .eq('group_id', groupId);
      
      if (groupError) throw groupError;
      const dogIds = groupData.map(d => d.dog_id);
      
      // Create a new session
      const { data: sessionData, error: sessionError } = await supabase
        .from('potty_break_sessions')
        .insert({
          notes: `Group ${status === 'out' ? 'went out' : 'came in'} at ${timeSlot}`,
          session_time: timestamp.toISOString(),
          created_by: user?.id
        })
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      // Add all dogs to the session
      const dogEntries = dogIds.map(dogId => ({
        session_id: sessionData.id,
        dog_id: dogId
      }));
      
      await supabase
        .from('potty_break_dogs')
        .insert(dogEntries);
      
      // Optimistic update
      setPottyBreaks(prev => {
        const updatedBreaks = { ...prev };
        
        dogIds.forEach(dogId => {
          const dog = dogsData.find(d => d.dog_id === dogId);
          const dogName = dog?.dog_name || dogId;
          
          if (!updatedBreaks[dogId]) {
            updatedBreaks[dogId] = [];
          }
          
          // Filter out any existing entry for this time slot
          const filteredBreaks = updatedBreaks[dogId].filter(entry => entry.timeSlot !== timeSlot);
          
          // Add the new entry
          updatedBreaks[dogId] = [
            ...filteredBreaks,
            {
              timeSlot,
              timestamp: timestamp.toISOString(),
              status,
              notes: `Group ${status === 'out' ? 'went out' : 'came in'} at ${timeSlot}`
            }
          ];
        });
        
        return updatedBreaks;
      });
      
      toast({
        title: `Group ${status === 'out' ? 'Out' : 'In'}`,
        description: `Dogs were marked as ${status === 'out' ? 'out' : 'in'} at ${timeSlot}`
      });
      
    } catch (error) {
      console.error('Error processing group potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to update potty break data for group',
        variant: 'destructive'
      });
    }
  }, [date, toast, user?.id, dogsData]);
  
  // Load potty breaks on mount and when date changes
  useEffect(() => {
    fetchPottyBreaks();
  }, [fetchPottyBreaks]);
  
  return {
    pottyBreaks,
    hasPottyBreak,
    getPottyBreakStatus,
    handleCellClick,
    handleGroupPottyBreak,
    refreshPottyBreaks: fetchPottyBreaks,
    isLoading,
    isDogOutside,
    getOutsideTime,
    incompatibilityWarning,
    clearIncompatibilityWarning
  };
};
