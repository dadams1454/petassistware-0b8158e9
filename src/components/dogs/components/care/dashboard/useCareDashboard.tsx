
import { useState, useEffect, useCallback } from 'react';
import { mockDogs } from '@/mockData/dogs';
import { mockCareLogs, mockCareTaskPresets } from '@/mockData/careLogs';
import { DogCareStatus } from '@/types/dailyCare';
import { v4 as uuidv4 } from 'uuid';

export const useCareDashboard = () => {
  // State variables
  const [activeView, setActiveView] = useState<string>('table'); // Default to table view
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dogStatuses, setDogStatuses] = useState<DogCareStatus[]>([]);
  
  // Function to fetch dog care statuses from mock data
  const fetchDogStatuses = useCallback(async () => {
    try {
      console.log('🔄 Fetching mock dog care statuses...');
      setLoading(true);
      
      // Create mock dog care statuses from dogs data
      const dogCareStatuses: DogCareStatus[] = mockDogs.map(dog => {
        // Find all care logs for this dog
        const dogLogs = mockCareLogs.filter(log => log.dog_id === dog.id);
        
        // Get latest potty, feeding, and medication logs
        const latestLogs: Record<string, string | null> = {};
        const categories = ['pottybreaks', 'feeding', 'medication'];
        
        categories.forEach(category => {
          const logsForCategory = dogLogs.filter(log => log.category === category);
          if (logsForCategory.length > 0) {
            // Sort by timestamp in descending order
            const sorted = [...logsForCategory].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            latestLogs[`last_${category}_time`] = sorted[0].timestamp;
          } else {
            latestLogs[`last_${category}_time`] = null;
          }
        });
        
        // Get most recent care log of any type
        let lastCare = null;
        if (dogLogs.length > 0) {
          const sorted = [...dogLogs].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          lastCare = {
            category: sorted[0].category,
            task_name: sorted[0].task_name,
            timestamp: sorted[0].timestamp,
            notes: sorted[0].notes
          };
        }
        
        // Create dog care status object
        return {
          dog_id: dog.id,
          dog_name: dog.name,
          breed: dog.breed || '',
          sex: dog.gender || '',
          color: dog.color || '',
          dog_photo: dog.photo_url || '',
          birthdate: dog.birthdate || '',
          requires_special_handling: dog.requires_special_handling || false,
          potty_alert_threshold: 300, // 5 hours in minutes
          max_time_between_breaks: 360, // 6 hours in minutes
          last_potty_time: latestLogs.last_pottybreaks_time,
          last_feeding_time: latestLogs.last_feeding_time,
          last_medication_time: latestLogs.last_medication_time,
          flags: [],
          created_at: dog.created_at,
          updated_at: dog.created_at,
          last_care: lastCare
        };
      });
      
      setDogStatuses(dogCareStatuses);
      console.log('✅ Fetched mock dog care statuses:', dogCareStatuses.length);
    } catch (error) {
      console.error('❌ Error loading dogs status:', error);
      setLoadError('Failed to load dogs. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch care categories from presets
  const loadCategories = useCallback(async () => {
    try {
      console.log('🔄 Loading care categories from presets...');
      const presets = mockCareTaskPresets;
      console.log('✅ Mock care presets loaded:', presets.length);
      const uniqueCategories = Array.from(new Set(presets.map(preset => preset.category)));
      setCategories(uniqueCategories);
      console.log('📋 Unique categories:', uniqueCategories);
      
      if (uniqueCategories.length > 0 && !selectedCategory) {
        // Set first category as default if none is selected
        setSelectedCategory(uniqueCategories[0]);
        console.log('🔍 Setting default category:', uniqueCategories[0]);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
    }
  }, [selectedCategory]);

  // Load categories and dog statuses on mount
  useEffect(() => {
    loadCategories();
    fetchDogStatuses();
  }, [loadCategories, fetchDogStatuses]);

  // Handler for refreshing data
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    fetchDogStatuses();
  }, [fetchDogStatuses]);

  // Handler for selecting a dog to log care
  const handleLogCare = (dogId: string) => {
    console.log('🐕 Selected dog for care logging:', dogId);
    setSelectedDogId(dogId);
    setDialogOpen(true);
  };

  // Success handler for when care is logged
  const handleCareLogSuccess = () => {
    console.log('✅ Care log success, closing dialog and refreshing');
    setDialogOpen(false);
    handleRefresh();
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    console.log('📋 Category changed to:', category);
    setSelectedCategory(category);
  };

  return {
    // State
    activeView,
    dialogOpen,
    selectedDogId,
    categories,
    selectedCategory,
    loading,
    loadError,
    dogStatuses,
    
    // Actions
    setActiveView,
    setDialogOpen,
    handleLogCare,
    handleRefresh,
    handleCareLogSuccess,
    handleCategoryChange
  };
};

export default useCareDashboard;
