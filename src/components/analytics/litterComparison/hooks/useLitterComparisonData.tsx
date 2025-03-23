
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from "react-day-picker";

export const useLitterComparisonData = (dateRange?: DateRange, filterBreed?: string) => {
  const [selectedDamId, setSelectedDamId] = useState<string | null>(null);

  // Fetch all breeds for filter dropdown
  const { data: breeds } = useQuery({
    queryKey: ['dog-breeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('breed')
        .not('breed', 'is', null)
        .order('breed');
      
      if (error) throw error;
      
      // Extract unique breeds
      const uniqueBreeds = Array.from(new Set(data.map(dog => dog.breed)))
        .filter(Boolean)
        .map(breed => ({ id: breed, name: breed }));
      
      return uniqueBreeds;
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });

  // We'll still need this query to get all dams
  const { data: dams, isLoading: isLoadingDams } = useQuery({
    queryKey: ['dams-with-litters', dateRange, filterBreed],
    queryFn: async () => {
      let query = supabase
        .from('dogs')
        .select(`
          id, 
          name,
          breed,
          color,
          litters:litters!litters_dam_id_fkey(id, litter_name, birth_date, sire_id, sire:dogs!litters_sire_id_fkey(id, breed))
        `)
        .eq('gender', 'Female')
        .filter('litters.id', 'not.is', null);
      
      if (filterBreed) {
        query = query.eq('breed', filterBreed);
      }
      
      const { data, error } = await query.order('name');

      if (error) throw error;
      
      // Filter litters by date range if provided
      let filteredData = data;
      if (dateRange?.from || dateRange?.to) {
        filteredData = data.map(dam => {
          const filteredLitters = dam.litters.filter(litter => {
            const litterDate = new Date(litter.birth_date);
            if (dateRange.from && dateRange.to) {
              return litterDate >= dateRange.from && litterDate <= dateRange.to;
            } else if (dateRange.from) {
              return litterDate >= dateRange.from;
            } else if (dateRange.to) {
              return litterDate <= dateRange.to;
            }
            return true;
          });
          
          return { ...dam, litters: filteredLitters };
        });
      }
      
      // Filter to only include dams with at least one litter after date filtering
      return (filteredData || []).filter(dam => dam.litters && dam.litters.length > 0);
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes in the background
  });

  // Fetch litter details for the selected dam, with improved caching
  const { data: litterDetails, isLoading: isLoadingLitters } = useQuery({
    queryKey: ['dam-litters', selectedDamId, dateRange],
    queryFn: async () => {
      if (!selectedDamId) return [];

      let query = supabase
        .from('litters')
        .select(`
          id,
          litter_name,
          birth_date,
          sire:dogs!litters_sire_id_fkey(id, name, breed, color),
          puppies:puppies!puppies_litter_id_fkey(*)
        `)
        .eq('dam_id', selectedDamId);
      
      // Apply date range filter if provided
      if (dateRange?.from) {
        query = query.gte('birth_date', dateRange.from.toISOString().split('T')[0]);
      }
      
      if (dateRange?.to) {
        query = query.lte('birth_date', dateRange.to.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query.order('birth_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedDamId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes in the background
  });

  // Reset selected dam when filters change
  useEffect(() => {
    setSelectedDamId(null);
  }, [dateRange, filterBreed]);

  // Set the first dam as selected when data loads
  useEffect(() => {
    if (dams && dams.length > 0 && !selectedDamId) {
      setSelectedDamId(dams[0].id);
    }
  }, [dams, selectedDamId]);

  return {
    breeds,
    dams,
    litterDetails,
    selectedDamId,
    setSelectedDamId,
    isLoadingDams,
    isLoadingLitters
  };
};
