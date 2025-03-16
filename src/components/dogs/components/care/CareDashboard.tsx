
import React, { useState, useEffect, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import CareDashboardHeader from './CareDashboardHeader';
import CareTabsContent from './CareTabsContent';
import TopCategoryTabs from './TopCategoryTabs';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from '@/components/ui/empty-state';
import { Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CareDashboardProps {}

const CareDashboard: React.FC<CareDashboardProps> = () => {
  // Essential state variables - ensure all are properly defined
  const [activeView, setActiveView] = useState<string>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
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
      ) : loadError ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-center text-red-600 dark:text-red-400">{loadError}</p>
          <div className="flex justify-center mt-4">
            <Button onClick={handleRefresh}>Try Again</Button>
          </div>
        </div>
      ) : dogStatuses && dogStatuses.length > 0 ? (
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
        <EmptyState
          icon={<Dog className="h-12 w-12 text-gray-400" />}
          title="No dogs found"
          description="No dogs found in the system. Please add dogs to start tracking their care."
          action={
            <Button onClick={handleRefresh}>
              Refresh
            </Button>
          }
        />
      )}
    </div>
  );
};

export default CareDashboard;
