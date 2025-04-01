
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VaccinationRecord, VaccinationScheduleItem } from '@/types/puppyTracking';

type ScheduledVaccination = {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  is_completed: boolean;
  notes?: string;
  vaccination_date?: string;
};

export const usePuppyVaccinations = (puppyId: string) => {
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [scheduledVaccinations, setScheduledVaccinations] = useState<VaccinationScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchVaccinations = async () => {
    if (!puppyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch administered vaccinations
      const { data: vaccinationsData, error: vaccinationsError } = await supabase
        .from('puppy_vaccinations')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('vaccination_date', { ascending: false });
      
      if (vaccinationsError) throw vaccinationsError;
      
      // Fetch scheduled vaccinations
      // In a real implementation, this would be from a separate table
      // Since vaccination_schedule table doesn't exist in the current setup,
      // we'll use a simulated approach
      const scheduledVaccinationsData: VaccinationScheduleItem[] = [];
      
      // Convert vaccinations to the scheduled format and calculate upcoming
      const upcomingVaccinations = (vaccinationsData || []).map(v => ({
        id: v.id,
        puppy_id: v.puppy_id,
        vaccination_type: v.vaccination_type,
        vaccination_date: v.vaccination_date,
        due_date: calculateNextDueDate(v.vaccination_type, v.vaccination_date),
        is_completed: false,
        notes: v.notes
      }));
      
      setVaccinations(vaccinationsData || []);
      setScheduledVaccinations([...scheduledVaccinationsData, ...upcomingVaccinations]);
    } catch (err) {
      console.error('Error fetching vaccinations:', err);
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate next due date based on vaccination type and last date
  const calculateNextDueDate = (type: string, lastDate: string): string => {
    const date = new Date(lastDate);
    
    // Simple schedule calculation - in reality, this would be more complex
    // based on breed, age, and specific vaccination requirements
    switch (type.toLowerCase()) {
      case 'rabies':
        date.setFullYear(date.getFullYear() + 1); // Annually
        break;
      case 'dhlpp':
      case 'distemper':
      case 'parvo':
        if (date.getFullYear() === new Date().getFullYear()) {
          date.setMonth(date.getMonth() + 3); // Booster
        } else {
          date.setFullYear(date.getFullYear() + 1); // Annual
        }
        break;
      case 'bordetella':
        date.setMonth(date.getMonth() + 6); // Every 6 months
        break;
      default:
        date.setFullYear(date.getFullYear() + 1); // Default annual
    }
    
    return date.toISOString().split('T')[0];
  };
  
  const addVaccination = async (vaccinationData: Partial<VaccinationRecord>) => {
    try {
      const { error: insertError } = await supabase
        .from('puppy_vaccinations')
        .insert({
          puppy_id: puppyId,
          ...vaccinationData,
          vaccination_date: vaccinationData.vaccination_date,
          vaccination_type: vaccinationData.vaccination_type
        });
      
      if (insertError) throw insertError;
      
      await fetchVaccinations();
      
      return { success: true };
    } catch (err) {
      console.error('Error adding vaccination:', err);
      throw err;
    }
  };
  
  const updateVaccinationSchedule = async (schedules: VaccinationScheduleItem[]) => {
    try {
      // This would be handled by updating a vaccination_schedule table
      // For now, just update the local state
      setScheduledVaccinations(schedules);
      
      return { success: true };
    } catch (err) {
      console.error('Error updating vaccination schedule:', err);
      throw err;
    }
  };
  
  // Calculate vaccination statistics
  const getVaccinationStatistics = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    // Filter for upcoming vaccinations due in the next 7 days
    const upcoming = scheduledVaccinations.filter(vax => {
      if (!vax.due_date || vax.is_completed) return false;
      const dueDate = new Date(vax.due_date);
      return dueDate >= today && dueDate <= nextWeek;
    });
    
    // Filter for completed vaccinations
    const completed = [...vaccinations, ...scheduledVaccinations.filter(v => v.is_completed)];
    
    // Filter for overdue vaccinations
    const overdue = scheduledVaccinations.filter(vax => {
      if (!vax.due_date || vax.is_completed) return false;
      const dueDate = new Date(vax.due_date);
      return dueDate < today;
    });
    
    return {
      upcoming,
      completed,
      overdue
    };
  };
  
  useEffect(() => {
    if (puppyId) {
      fetchVaccinations();
    }
  }, [puppyId]);
  
  const stats = getVaccinationStatistics();
  
  return {
    vaccinations,
    scheduledVaccinations,
    isLoading,
    error,
    fetchVaccinations,
    addVaccination,
    updateVaccinationSchedule,
    upcomingVaccinations: stats.upcoming,
    completedVaccinations: stats.completed,
    overdueVaccinations: stats.overdue
  };
};
