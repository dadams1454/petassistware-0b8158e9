
import React, { useState, useEffect, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { DogCareStatus } from '@/types/dailyCare';
import CareDashboardHeader from './CareDashboardHeader';
import CareTabsContent from './CareTabsContent';
import TopCategoryTabs from './TopCategoryTabs';
import LoadingSpinner from './LoadingSpinner';

const CareDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [dogsStatus, setDogsStatus] = useState<DogCareStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { fetchAllDogsWithCareStatus, loading, fetchCareTaskPresets } = useDailyCare();

  // Function to fetch all dogs care status
  const loadDogsStatus = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchAllDogsWithCareStatus();
    setDogsStatus(data);
    setIsLoading(false);
  }, [fetchAllDogsWithCareStatus]);

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

  // Initial data loading
  useEffect(() => {
    loadDogsStatus();
    loadCategories();
  }, [loadDogsStatus, loadCategories]);

  // Handler for selecting a dog to log care
  const handleLogCare = (dogId: string) => {
    setSelectedDogId(dogId);
    setDialogOpen(true);
  };

  // Success handler for when care is logged
  const handleCareLogSuccess = () => {
    setDialogOpen(false);
    loadDogsStatus();
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-4">
      <CareDashboardHeader 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      
      {categories.length > 0 && (
        <TopCategoryTabs 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}
      
      {isLoading || loading ? (
        <LoadingSpinner />
      ) : (
        <CareTabsContent
          activeTab={activeView}
          dogsStatus={dogsStatus}
          onLogCare={handleLogCare}
          selectedDogId={selectedDogId}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onCareLogSuccess={handleCareLogSuccess}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
};

export default CareDashboard;
