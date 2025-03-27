import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CareCategory } from '@/types/careCategories';
import { useCareCategories } from '@/contexts/CareCategories/CareCategoriesContext';
import { useDailyCare } from '@/contexts/dailyCare';
import { CareCategoriesProvider } from '@/contexts/CareCategories/CareCategoriesContext';
import DailyCareLayout from './layout/DailyCareLayout';
import { EmptyState, SectionHeader } from '@/components/ui/standardized';
import { useRefresh } from '@/contexts/RefreshContext';
import { Dog, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// We'll import these components as needed
import PuppyCare from './categories/puppy/PuppyCare';
// Other category components will be lazily loaded

interface ModularDailyCareProps {
  // Optional props can be added here
}

const ModularDailyCare: React.FC<ModularDailyCareProps> = () => {
  const [activeCategory, setActiveCategory] = useState<CareCategory>('potty');
  const { categories } = useCareCategories();
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { currentDate } = useRefresh();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [dogs, setDogs] = useState<any[]>([]);
  
  const fetchDogs = async () => {
    try {
      setIsLoading(true);
      const dogsData = await fetchAllDogsWithCareStatus(currentDate, true);
      setDogs(dogsData || []);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDogs();
  }, [currentDate]);
  
  const handleRefresh = () => {
    fetchDogs();
  };
  
  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };
  
  // The main content for the component based on active category
  const renderCategoryContent = () => {
    // If no dogs, show empty state
    if (!isLoading && (!dogs || dogs.length === 0)) {
      return (
        <EmptyState
          icon={<Dog className="h-12 w-12 text-muted-foreground" />}
          title="No Dogs Found"
          description="Add dogs to your kennel to start tracking their daily care activities."
          action={{
            label: "Add Dogs",
            onClick: handleNavigateToDogs
          }}
        />
      );
    }
    
    // Return the appropriate component based on the active category
    switch (activeCategory) {
      case 'puppy':
        return <PuppyCare />;
      // We'll add other categories later as we build them
      default:
        // Temporary placeholder until we build each specialized component
        return (
          <div className="p-4 text-center">
            <p>The {categories.find(c => c.id === activeCategory)?.name} module is coming soon.</p>
            <Button onClick={handleRefresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        );
    }
  };
  
  return (
    <DailyCareLayout
      title="Daily Care"
      description="Track daily care activities for all your dogs"
      onRefresh={handleRefresh}
      isLoading={isLoading}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
    >
      {renderCategoryContent()}
    </DailyCareLayout>
  );
};

// Wrap the component with the care categories provider
const ModularDailyCareWithProvider: React.FC = () => (
  <CareCategoriesProvider>
    <ModularDailyCare />
  </CareCategoriesProvider>
);

export default ModularDailyCareWithProvider;
