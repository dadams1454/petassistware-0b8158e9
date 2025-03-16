
import { useState, useEffect, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';

export const useCareDashboard = () => {
  // State variables
  const [activeView, setActiveView] = useState<string>('table'); // Changed default from 'cards' to 'table'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Get daily care context
  const { 
    fetchAllDogsWithCareStatus, 
    fetchCareTaskPresets,
    dogStatuses 
  } = useDailyCare();

  // Function to fetch all dogs care status
  const loadDogsStatus = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      console.log('🔄 Loading dogs status...');
      const dogs = await fetchAllDogsWithCareStatus(new Date(), true);
      console.log('✅ Dogs loaded successfully:', dogs.length);
      if (dogs.length > 0) {
        console.log('🐕 Dogs data sample:', dogs.slice(0, 3).map(d => d.dog_name).join(', '));
        console.log('🐕 All dog names:', dogs.map(d => d.dog_name).join(', '));
      } else {
        console.warn('⚠️ No dogs were returned from the API');
      }
      return dogs;
    } catch (error) {
      console.error('❌ Error loading dogs status:', error);
      setLoadError('Failed to load dogs. Please try refreshing the page.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchAllDogsWithCareStatus]);

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

  // Initial data loading - runs exactly once on mount
  useEffect(() => {
    if (!initialLoadAttempted) {
      console.log('🚀 Initial data loading for CareDashboard');
      
      Promise.all([loadDogsStatus(), loadCategories()])
        .then(() => {
          console.log('✅ Initial data loaded successfully');
        })
        .catch(error => {
          console.error('❌ Error during initial data loading:', error);
        })
        .finally(() => {
          setInitialLoadAttempted(true);
        });
    }
  }, [initialLoadAttempted, loadDogsStatus, loadCategories]);

  // Handler for refreshing data
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    setLoading(true);
    loadDogsStatus();
  }, [loadDogsStatus]);

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

  // Debug output for current state
  useEffect(() => {
    console.log(`📊 Dashboard state: View=${activeView}, Category=${selectedCategory}, Dogs=${dogStatuses?.length || 0}, Loading=${loading}`);
    if (dogStatuses && dogStatuses.length > 0) {
      console.log('🐕 First few dogs:', dogStatuses.slice(0, 3).map(d => d.dog_name).join(', '));
    }
  }, [activeView, selectedCategory, dogStatuses, loading]);

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
