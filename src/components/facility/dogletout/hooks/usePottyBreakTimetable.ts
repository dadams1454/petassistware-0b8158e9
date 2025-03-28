
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DogCareStatus } from '@/types/dailyCare';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

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
        // No current entry - mark dog as "out"
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
  }, [pottyBreaks, getPottyBreakStatus, date, toast, user?.id]);
  
  // Load potty breaks on mount and when date changes
  useEffect(() => {
    fetchPottyBreaks();
  }, [fetchPottyBreaks]);
  
  return {
    pottyBreaks,
    hasPottyBreak,
    getPottyBreakStatus,
    handleCellClick,
    refreshPottyBreaks: fetchPottyBreaks,
    isLoading
  };
};
