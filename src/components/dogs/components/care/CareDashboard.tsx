
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
    handleCareLogSuccess,
    handleCategoryChange
  } = useCareDashboard();

  // Function to handle retry when loading fails
  const handleRetry = () => {
    console.log('Retrying data fetch');
    // This will trigger a refresh through the useCareDashboard hook
    window.location.reload();
  };

  // Log when component mounts and when dogStatuses change
  React.useEffect(() => {
    console.log('🚀 CareDashboard mounted');
    console.log(`🐕 dogStatuses available: ${dogStatuses?.length || 0} dogs`);
  }, [dogStatuses]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CareDashboardHeader 
          title="Care Dashboard"
          isLoading={loading}
        />
      </div>
      
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
        onRetry={handleRetry}
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
        <NoDogsState />
      ) : null}
    </div>
  );
};

export default CareDashboard;
