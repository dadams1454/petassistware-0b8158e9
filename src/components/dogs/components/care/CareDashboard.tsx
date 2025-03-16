
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
      console.log('🔄 Loading dogs status...');
      const dogs = await fetchAllDogsWithCareStatus();
      console.log('✅ Dogs loaded successfully:', dogs.length);
      if (dogs.length > 0) {
        console.log('🐕 Dogs data sample:', dogs.slice(0, 3).map(d => d.dog_name).join(', '));
      }
      return dogs;
    } catch (error) {
      console.error('❌ Error loading dogs status:', error);
      return [];
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

  // Initial data loading - fetch only once during component mount
  useEffect(() => {
    if (!hasInitiallyLoaded) {
      console.log('🚀 Initial data loading for CareDashboard');
      
      // Add check for dogStatuses to detect if they're already loaded
      if (dogStatuses && dogStatuses.length > 0) {
        console.log('📋 Dogs already loaded:', dogStatuses.length);
        console.log('🐕 Dog names:', dogStatuses.slice(0, 10).map(d => d.dog_name).join(', '));
        setHasInitiallyLoaded(true);
      } else {
        Promise.all([loadDogsStatus(), loadCategories()])
          .then(() => {
            console.log('✅ Initial data loaded successfully');
            setHasInitiallyLoaded(true);
          })
          .catch(error => {
            console.error('❌ Error during initial data loading:', error);
            // Set loaded anyway to prevent infinite loops
            setHasInitiallyLoaded(true);
          });
      }
    }
  }, [loadDogsStatus, loadCategories, hasInitiallyLoaded, dogStatuses]);

  // Handler for refreshing data
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
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
    loadDogsStatus(); // Explicitly reload data after care is logged
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    console.log('📋 Category changed to:', category);
    setSelectedCategory(category);
  };

  // Debug output for current state
  useEffect(() => {
    if (dogStatuses) {
      console.log(`📊 Dashboard state: View=${activeView}, Category=${selectedCategory}, Dogs=${dogStatuses.length}, Loading=${loading}`);
      if (dogStatuses.length > 0) {
        console.log('🐕 First few dogs:', dogStatuses.slice(0, 3).map(d => d.dog_name).join(', '));
      }
    }
  }, [activeView, selectedCategory, dogStatuses, loading]);

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
        <div className="mt-4">
          <LoadingSpinner />
          <p className="text-center mt-2 text-gray-500">Loading dogs data...</p>
        </div>
      ) : (
        dogStatuses && dogStatuses.length > 0 ? (
          <>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md mb-2">
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ Loaded {dogStatuses.length} dogs successfully: {dogStatuses.slice(0, 5).map(d => d.dog_name).join(', ')}
                {dogStatuses.length > 5 ? ` and ${dogStatuses.length - 5} more` : ''}
              </p>
            </div>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
              <p className="text-lg text-gray-600 dark:text-gray-300">No dogs found in the system.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please add dogs to start tracking their care.</p>
              <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded text-xs text-left">
                Debug info:
                hasInitiallyLoaded: {hasInitiallyLoaded ? 'true' : 'false'}
                dogStatuses: {dogStatuses ? `Array(${dogStatuses.length})` : 'undefined'}
                loading: {loading ? 'true' : 'false'}
              </pre>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CareDashboard;
