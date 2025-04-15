
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DogCareStatus, DogFlag } from '@/types';

// Define the categories including new 'puppies'
const CARE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'potty', label: 'Potty Breaks' },
  { id: 'feeding', label: 'Feeding' },
  { id: 'medications', label: 'Medications' },
  { id: 'puppies', label: 'Puppies' },
  { id: 'health', label: 'Health' },
  { id: 'exercise', label: 'Exercise' }
];

// Views for dog care display
type ActiveView = 'grid' | 'table' | 'list';

export function useCareDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dogStatuses, setDogStatuses] = useState<DogCareStatus[]>([]);

  const categories = CARE_CATEGORIES;

  // Fetch dogs with care status
  const fetchDogStatuses = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          id,
          name,
          breed,
          gender,
          color,
          birthdate,
          photo_url,
          requires_special_handling,
          potty_alert_threshold,
          max_time_between_breaks
        `)
        .order('name');

      if (error) throw error;

      // Get current timestamp for created_at/updated_at if missing
      const now = new Date().toISOString();

      // Transform dogs data for UI display with error handling
      const dogsWithCareStatus: DogCareStatus[] = (data || []).map(dog => ({
        dog_id: dog?.id || '',
        dog_name: dog?.name || '',
        breed: dog?.breed || '',
        sex: dog?.gender || '',
        color: dog?.color || '',
        dog_photo: dog?.photo_url || '',
        birthdate: dog?.birthdate || '',
        requires_special_handling: dog?.requires_special_handling || false,
        last_potty_time: null,
        last_feeding_time: null,
        last_medication_time: null,
        potty_alert_threshold: dog?.potty_alert_threshold || 300,
        max_time_between_breaks: dog?.max_time_between_breaks || 360,
        last_care: null,
        flags: [] as DogFlag[],
        created_at: now,
        updated_at: now
      }));

      setDogStatuses(dogsWithCareStatus);
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setLoadError('Failed to load dogs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle care log
  const handleLogCare = (dogId: string) => {
    setSelectedDogId(dogId);
    setDialogOpen(true);
  };

  // Handle care log success
  const handleCareLogSuccess = () => {
    setDialogOpen(false);
    fetchDogStatuses();
  };

  useEffect(() => {
    fetchDogStatuses();
  }, [fetchDogStatuses]);

  return {
    activeView,
    dialogOpen,
    selectedDogId,
    categories,
    selectedCategory,
    loading,
    loadError,
    dogStatuses,
    setActiveView,
    setDialogOpen,
    handleLogCare,
    handleRefresh: fetchDogStatuses,
    handleCareLogSuccess,
    handleCategoryChange
  };
}
