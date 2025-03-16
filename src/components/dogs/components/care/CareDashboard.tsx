
import React, { useState, useEffect, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import CareDashboardHeader from './CareDashboardHeader';
import CareTabsContent from './CareTabsContent';
import TopCategoryTabs from './TopCategoryTabs';
import LoadingSpinner from './LoadingSpinner';

interface CareDashboardProps {}

const CareDashboard: React.FC<CareDashboardProps> = () => {
  const [activeView, setActiveView] = useState<string>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  const { 
    fetchAllDogsWithCareStatus, 
    loading, 
    fetchCareTaskPresets,
    dogStatuses 
  } = useDailyCare();

  // Function to fetch all dogs care status
  const loadDogsStatus = useCallback(async () => {
    try {
      await fetchAllDogsWithCareStatus();
      console.log('Dogs loaded successfully:', dogStatuses?.length || 0);
    } catch (error) {
      console.error('Error loading dogs status:', error);
    }
  }, [fetchAllDogsWithCareStatus, dogStatuses]);

  // Function to fetch categories
  const loadCategories = useCallback(async () => {
    try {
      const presets = await fetchCareTaskPresets();
      const uniqueCategories = Array.from(new Set(presets.map(preset => preset.category)));
      setCategories(uniqueCategories);
      if (uniqueCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [fetchCareTaskPresets, selectedCategory]);

  // Initial data loading - fetch only once during component mount
  useEffect(() => {
    if (!hasInitiallyLoaded) {
      console.log('Initial data loading');
      loadDogsStatus();
      loadCategories();
      setHasInitiallyLoaded(true);
    }
  }, [loadDogsStatus, loadCategories, hasInitiallyLoaded]);

  // Handler for refreshing data
  const handleRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    loadDogsStatus();
  }, [loadDogsStatus]);

  // Handler for selecting a dog to log care
  const handleLogCare = (dogId: string) => {
    setSelectedDogId(dogId);
    setDialogOpen(true);
  };

  // Success handler for when care is logged
  const handleCareLogSuccess = () => {
    setDialogOpen(false);
    loadDogsStatus(); // Explicitly reload data after care is logged
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-4">
      <CareDashboardHeader 
        view={activeView} 
        onViewChange={setActiveView}
        onRefresh={handleRefresh}
      />
      
      {categories.length > 0 && (
        <TopCategoryTabs 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        dogStatuses && dogStatuses.length > 0 ? (
          <CareTabsContent
            activeTab={activeView}
            dogsStatus={dogStatuses}
            onLogCare={handleLogCare}
            selectedDogId={selectedDogId}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            onCareLogSuccess={handleCareLogSuccess}
            selectedCategory={selectedCategory}
          />
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
              <p className="text-lg text-gray-600 dark:text-gray-300">No dogs found in the system.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please add dogs to start tracking their care.</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CareDashboard;
