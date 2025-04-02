
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { addDays, differenceInDays, isPast } from 'date-fns';

interface Dog {
  id: string;
  name: string;
  gender: string;
  last_heat_date?: string;
  is_pregnant?: boolean;
}

interface HeatCycleAlert {
  dogId: string;
  dogName: string;
  alertType: 'upcoming' | 'active';
  daysUntil?: number;
  daysPast?: number;
}

export const useHeatCycleStatus = () => {
  // Fetch all female dogs
  const { data: femaleDogs, isLoading } = useQuery({
    queryKey: ['heat-cycle-female-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, gender, last_heat_date, is_pregnant')
        .eq('gender', 'Female')
        .order('name');
        
      if (error) throw error;
      return (data || []) as Dog[];
    }
  });
  
  // Calculate heat cycle alerts
  const alerts = useMemo(() => {
    if (!femaleDogs) return [];
    
    const today = new Date();
    const heatCycleAlerts: HeatCycleAlert[] = [];
    
    femaleDogs.forEach(dog => {
      if (dog.is_pregnant || !dog.last_heat_date) return;
      
      const lastHeatDate = new Date(dog.last_heat_date);
      const nextHeatDate = addDays(lastHeatDate, 180); // Approximately 6 months
      
      // Check if next heat is within the next 14 days
      const daysUntilNextHeat = differenceInDays(nextHeatDate, today);
      
      if (daysUntilNextHeat <= 14 && daysUntilNextHeat > 0) {
        heatCycleAlerts.push({
          dogId: dog.id,
          dogName: dog.name,
          alertType: 'upcoming',
          daysUntil: daysUntilNextHeat
        });
      }
      
      // Check if dog is likely in heat now (first 21 days after expected heat start)
      if (isPast(nextHeatDate) && differenceInDays(today, nextHeatDate) <= 21) {
        heatCycleAlerts.push({
          dogId: dog.id,
          dogName: dog.name,
          alertType: 'active',
          daysPast: differenceInDays(today, nextHeatDate)
        });
      }
    });
    
    return heatCycleAlerts;
  }, [femaleDogs]);
  
  return {
    alerts,
    isLoading,
    hasAlerts: alerts.length > 0
  };
};
