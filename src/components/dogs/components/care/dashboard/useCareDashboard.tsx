
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useRefresh } from '@/contexts/refreshContext';

export const useCareDashboard = () => {
  // State variables
  const [activeView, setActiveView] = useState<string>('table'); // Default to table view
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const initialFetchRef = useRef(false);
  
  // Get daily care context
  const { 
    fetchAllDogsWithCareStatus, 
    fetchCareTaskPresets,
    dogStatuses 
  } = useDailyCare();

  // Use the centralized refresh system
  const { isRefreshing: loading, handleRefresh } = useRefresh('dogs');

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

  // Initial data loading - only once
  useEffect(() => {
    if (!initialFetchRef.current) {
      console.log('🚀 Initial data loading for CareDashboard');
      initialFetchRef.current = true;
      
      Promise.all([handleRefresh(), loadCategories()])
        .then(() => {
          console.log('✅ Initial data loaded successfully');
        })
        .catch(error => {
          console.error('❌ Error during initial data loading:', error);
        });
    }
  }, [handleRefresh, loadCategories]);

  // Check for missing dogs only when needed, not on every render
  useEffect(() => {
    if (initialFetchRef.current && (!dogStatuses || dogStatuses.length === 0)) {
      console.log('⚠️ No dogs found after initial load, forcing a refresh');
      handleRefresh();
    }
  }, [dogStatuses, handleRefresh]);

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
    handleCareLogSuccess,
    handleCategoryChange
  };
};
