
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addDays, isWithinDays, format } from 'date-fns';
import { customSupabase } from '@/integrations/supabase/client';

export const useHeatCycleAlerts = (dogs: any[] = []) => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for female dogs with upcoming or active heat cycles
    const femaleDogs = dogs.filter(dog => dog.gender === 'Female');
    
    femaleDogs.forEach(dog => {
      const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
      
      if (!lastHeatDate) return;
      
      // Calculate next heat (roughly 6 months after last heat)
      const nextHeatDate = addDays(lastHeatDate, 180);
      const today = new Date();
      
      // Check if we're within 7 days of the next heat
      if (isWithinDays(today, nextHeatDate, 7)) {
        // Dog's heat cycle is approaching, show notification
        toast({
          title: "Heat Cycle Alert",
          description: `${dog.name}'s heat cycle is approaching (expected around ${format(nextHeatDate, 'MMM d')})`,
          variant: "default",
          duration: 5000, // Show for 5 seconds
        });
      }
      
      // Check if we're likely within active heat (first 21 days after start)
      const heatEndDate = addDays(nextHeatDate, 21);
      if (today >= nextHeatDate && today <= heatEndDate) {
        // Dog is likely in heat, show notification
        toast({
          title: "Active Heat Cycle",
          description: `${dog.name} is currently in heat. Consider separation protocols.`,
          variant: "destructive",
          duration: 5000, // Show for 5 seconds
        });
      }
    });
  }, [dogs, toast]);
  
  const recordHeatDate = async (dogId: string, heatStartDate: Date) => {
    try {
      const { error } = await customSupabase
        .from('dogs')
        .update({ 
          last_heat_date: heatStartDate.toISOString().split('T')[0],
          is_pregnant: false // Reset pregnancy status if manually recording heat
        })
        .eq('id', dogId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error recording heat date:', error);
      return false;
    }
  };
  
  const markAsPregnant = async (dogId: string, tieDate: Date) => {
    try {
      const { error } = await customSupabase
        .from('dogs')
        .update({ 
          tie_date: tieDate.toISOString().split('T')[0],
          is_pregnant: true
        })
        .eq('id', dogId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error marking dog as pregnant:', error);
      return false;
    }
  };
  
  return {
    recordHeatDate,
    markAsPregnant
  };
};

// Helper function to check if a date is within X days of a target date
function isWithinDays(date: Date, targetDate: Date, days: number): boolean {
  const earliestDate = addDays(targetDate, -days);
  const latestDate = addDays(targetDate, days);
  
  return (
    date >= earliestDate && date <= latestDate
  );
}
