
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VaccinationRecord, VaccinationScheduleItem } from '@/types/puppyTracking';

export const usePuppyVaccinations = (puppyId: string) => {
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [scheduledVaccinations, setScheduledVaccinations] = useState<VaccinationScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVaccinations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch completed vaccinations
      const { data: vaccinationData, error: vaccinationError } = await supabase
        .from('puppy_vaccinations')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('vaccination_date', { ascending: false });
      
      if (vaccinationError) throw vaccinationError;
      
      // Fetch scheduled vaccinations
      const { data: scheduledData, error: scheduledError } = await supabase
        .from('vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('due_date', { ascending: true });
      
      if (scheduledError) throw scheduledError;
      
      setVaccinations(vaccinationData || []);
      setScheduledVaccinations(scheduledData || []);
    } catch (err) {
      console.error('Error fetching vaccinations:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute derived data
  const upcomingVaccinations = useMemo(() => {
    return scheduledVaccinations.filter(vax => !vax.is_completed && new Date(vax.due_date) >= new Date());
  }, [scheduledVaccinations]);

  const completedVaccinations = useMemo(() => {
    return [
      ...vaccinations.filter(vax => vax.vaccination_date),
      ...scheduledVaccinations.filter(vax => vax.is_completed)
    ];
  }, [vaccinations, scheduledVaccinations]);

  const overdueVaccinations = useMemo(() => {
    return scheduledVaccinations.filter(
      vax => !vax.is_completed && new Date(vax.due_date) < new Date()
    );
  }, [scheduledVaccinations]);

  const addVaccination = async (vaccinationData: Partial<VaccinationRecord>) => {
    try {
      const dataWithPuppyId = {
        ...vaccinationData,
        puppy_id: puppyId,
        vaccination_date: vaccinationData.vaccination_date || new Date().toISOString().split('T')[0],
        vaccination_type: vaccinationData.vaccination_type || 'Unknown'
      };
      
      const { data, error: insertError } = await supabase
        .from('puppy_vaccinations')
        .insert(dataWithPuppyId);
        
      if (insertError) throw insertError;
      
      // If this is a scheduled vaccination, mark it as completed
      if (vaccinationData.vaccination_type) {
        const matchingScheduledItems = scheduledVaccinations.filter(
          item => item.vaccination_type === vaccinationData.vaccination_type && !item.is_completed
        );
        
        if (matchingScheduledItems.length > 0) {
          const scheduledItem = matchingScheduledItems[0];
          await supabase
            .from('vaccination_schedule')
            .update({
              is_completed: true,
              vaccination_date: vaccinationData.vaccination_date
            })
            .eq('id', scheduledItem.id);
        }
      }
      
      // Refresh data
      await fetchVaccinations();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error adding vaccination:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (puppyId) {
      fetchVaccinations();
    }
  }, [puppyId]);

  return {
    vaccinations,
    scheduledVaccinations,
    upcomingVaccinations,
    completedVaccinations,
    overdueVaccinations,
    isLoading,
    error,
    fetchVaccinations,
    addVaccination
  };
};
