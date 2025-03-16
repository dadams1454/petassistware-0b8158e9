
import React from 'react';
import CareDashboardHeader from './CareDashboardHeader';
import TopCategoryTabs from './TopCategoryTabs';
import LoadingState from './dashboard/LoadingState';
import NoDogsState from './dashboard/NoDogsState';
import LoadedDogsContent from './dashboard/LoadedDogsContent';
import { useCareDashboard } from './dashboard/useCareDashboard';

interface CareDashboardProps {}

const CareDashboard: React.FC<CareDashboardProps> = () => {
  const {
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
    handleRefresh,
    handleCareLogSuccess,
    handleCategoryChange
  } = useCareDashboard();

  // Log when component mounts and when dogStatuses change
  React.useEffect(() => {
    console.log('🚀 CareDashboard mounted');
    console.log(`🐕 dogStatuses available: ${dogStatuses?.length || 0} dogs`);
    
    // Log all dog names if available
    if (dogStatuses && dogStatuses.length > 0) {
      console.log('🐕 Available dogs:', dogStatuses.map(d => d.dog_name).join(', '));
    }
  }, [dogStatuses]);

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
      
      <LoadingState 
        isLoading={loading} 
        error={loadError} 
        onRetry={handleRefresh} 
      />
      
      {!loading && !loadError && dogStatuses && dogStatuses.length > 0 ? (
        <LoadedDogsContent 
          dogStatuses={dogStatuses}
          activeView={activeView}
          selectedCategory={selectedCategory}
          selectedDogId={selectedDogId}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onLogCare={handleLogCare}
          onCareLogSuccess={handleCareLogSuccess}
        />
      ) : (!loading && !loadError && (!dogStatuses || dogStatuses.length === 0)) ? (
        <NoDogsState onRefresh={handleRefresh} />
      ) : null}
    </div>
  );
};

export default CareDashboard;
