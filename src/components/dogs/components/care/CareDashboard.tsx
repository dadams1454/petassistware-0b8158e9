
import React from 'react';
import CareDashboardHeader from './CareDashboardHeader';
import TopCategoryTabs from './TopCategoryTabs';
import LoadingState from './dashboard/LoadingState';
import NoDogsState from './dashboard/NoDogsState';
import LoadedDogsContent from './dashboard/LoadedDogsContent';
import { useCareDashboard } from './dashboard/useCareDashboard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  }, [dogStatuses]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CareDashboardHeader 
          title="Care Dashboard"
          onRefresh={handleRefresh}
          isLoading={loading}
        />
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="gap-2 bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Dogs
        </Button>
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
