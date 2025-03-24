
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useRefresh } from '@/contexts/RefreshContext';
import { useRefreshData } from '@/hooks/useRefreshData';

export const useCareDashboard = () => {
  // State variables
  const [activeView, setActiveView] = useState<string>('table'); // Default to table view
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Get daily care context and refresh context
  const { fetchCareTaskPresets, fetchAllDogsWithCareStatus } = useDailyCare();
  const { currentDate } = useRefresh();
  
  // Use centralized refresh for dog statuses
  const { 
    data: dogStatuses,
    isLoading: loading,
    refresh: refreshDogStatuses
  } = useRefreshData({
    key: 'careDashboardDogs',
    fetchData: useCallback(async () => {
      try {
        // Use the dailyCare context's fetch function
        const dogs = await fetchAllDogsWithCareStatus(new Date(), true);
        return dogs;
      } catch (error) {
        console.error('❌ Error loading dogs status:', error);
        setLoadError('Failed to load dogs. Please try refreshing the page.');
        return [];
      }
    }, [fetchAllDogsWithCareStatus]),
    loadOnMount: true
  });

  // Function to fetch categories
  const loadCategories = useCallback(async () => {
    try {
      console.log('🔄 Loading care categories...');
      const presets = await fetchCareTaskPresets();
      console.log('✅ Care presets loaded:', presets.length);
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
  }, [fetchCareTaskPresets, selectedCategory]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Handler for refreshing data
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    refreshDogStatuses(true);
  }, [refreshDogStatuses]);

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
