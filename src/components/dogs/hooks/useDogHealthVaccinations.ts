
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VaccinationDisplay } from '../types/vaccination';
import { getVaccinationTypeLabel } from '../utils/vaccinationUtils';

// Type to handle the Supabase response
type VaccinationResponse = {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes: string | null;
  created_at: string;
}

export const useDogHealthVaccinations = (dogId: string | undefined) => {
  const [vaccinations, setVaccinations] = useState<VaccinationDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVaccinations = async () => {
      if (!dogId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('dog_vaccinations')
          .select('*')
          .eq('dog_id', dogId)
          .order('vaccination_date', { ascending: false }) as { data: VaccinationResponse[] | null, error: any };
        
        if (error) throw error;
        
        // Transform data to display format
        const displayData: VaccinationDisplay[] = (data || []).map(vax => ({
          type: getVaccinationTypeLabel(vax.vaccination_type),
          date: new Date(vax.vaccination_date),
          notes: vax.notes || undefined,
          id: vax.id
        }));
        
        setVaccinations(displayData);
      } catch (error) {
        console.error('Error fetching vaccinations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVaccinations();
  }, [dogId]);

  // Get most recent vaccination of each type
  const getLatestVaccinations = () => {
    const latestByType = new Map<string, VaccinationDisplay>();
    
    vaccinations.forEach(vax => {
      if (!latestByType.has(vax.type) || vax.date > latestByType.get(vax.type)!.date) {
        latestByType.set(vax.type, vax);
      }
    });
    
    return Array.from(latestByType.values());
  };

  return {
    vaccinations,
    latestVaccinations: getLatestVaccinations(),
    isLoading,
    getVaccinationTypeLabel
  };
};
