
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VaccinationRecord, VaccinationScheduleItem } from '@/types/puppyTracking';
import { toast } from '@/hooks/use-toast';

export const usePuppyVaccinations = (puppyId: string) => {
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [scheduledVaccinations, setScheduledVaccinations] = useState<VaccinationScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!puppyId) return;
    fetchVaccinations();
  }, [puppyId]);

  const fetchVaccinations = async () => {
    setIsLoading(true);
    try {
      // Fetch administered vaccinations
      const { data: vaccinationsData, error: vaccinationsError } = await supabase
        .from('puppy_vaccinations')
        .select('*')
        .eq('puppy_id', puppyId);

      if (vaccinationsError) throw new Error(vaccinationsError.message);

      // Fetch scheduled vaccinations
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId);

      if (scheduleError) throw new Error(scheduleError.message);

      // Convert to our application types
      const formattedVaccinations: VaccinationRecord[] = vaccinationsData?.map(record => ({
        id: record.id,
        puppy_id: record.puppy_id,
        vaccination_type: record.vaccination_type,
        vaccination_date: record.vaccination_date,
        administered_by: record.administered_by,
        lot_number: record.lot_number,
        notes: record.notes,
        created_at: record.created_at,
      })) || [];

      const formattedSchedule: VaccinationScheduleItem[] = scheduleData?.map(record => ({
        id: record.id,
        puppy_id: record.puppy_id,
        vaccination_type: record.vaccination_type,
        due_date: record.due_date,
        notes: record.notes,
        created_at: record.created_at,
        is_completed: false, // Default to false
      })) || [];

      // Mark scheduled items as completed if there's a matching vaccination
      const updatedSchedule = formattedSchedule.map(item => {
        const hasVaccination = formattedVaccinations.some(
          v => v.vaccination_type === item.vaccination_type
        );
        return { ...item, is_completed: hasVaccination };
      });

      setVaccinations(formattedVaccinations);
      setScheduledVaccinations(updatedSchedule);
    } catch (err) {
      console.error('Error fetching vaccinations:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const addVaccination = async (vaccinationData: Partial<VaccinationRecord>) => {
    try {
      // Ensure required fields are present
      if (!vaccinationData.vaccination_date || !vaccinationData.vaccination_type) {
        throw new Error('Vaccination date and type are required');
      }

      const newVaccination = {
        puppy_id: puppyId,
        ...vaccinationData,
      };

      // Insert the vaccination record
      const { data, error } = await supabase
        .from('puppy_vaccinations')
        .insert([
          {
            puppy_id: puppyId,
            vaccination_type: vaccinationData.vaccination_type,
            vaccination_date: vaccinationData.vaccination_date,
            administered_by: vaccinationData.administered_by,
            lot_number: vaccinationData.lot_number,
            notes: vaccinationData.notes,
          }
        ]);

      if (error) throw error;

      // Update the scheduled vaccinations status if applicable
      await updateScheduleStatus(vaccinationData.vaccination_type || '');
      
      // Refresh data
      await fetchVaccinations();
      
      toast({
        title: 'Vaccination recorded',
        description: 'The vaccination has been successfully added.',
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error adding vaccination:', err);
      toast({
        title: 'Error adding vaccination',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return { success: false, error: err };
    }
  };

  const updateScheduleStatus = async (vaccinationType: string) => {
    // Find matching scheduled vaccination
    const scheduledItem = scheduledVaccinations.find(
      item => item.vaccination_type === vaccinationType && !item.is_completed
    );

    if (scheduledItem) {
      // Update the scheduled vaccination to mark it as completed
      await supabase
        .from('puppy_vaccination_schedule')
        .update({ is_completed: true })
        .eq('id', scheduledItem.id);
    }
  };

  return {
    vaccinations,
    scheduledVaccinations,
    isLoading,
    error,
    fetchVaccinations,
    addVaccination,
  };
};
