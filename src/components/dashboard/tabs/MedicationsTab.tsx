
import React, { useState, useEffect } from 'react';
import { MedicationsTabProps } from '@/components/dogs/components/care/medications/types/medicationTypes';
import MedicationsLog from '@/components/dogs/components/care/medications/MedicationsLog';
import MedicationFilter from '@/components/dogs/components/care/medications/components/MedicationFilter';
import MedicationHeader from '@/components/dogs/components/care/medications/components/MedicationHeader';
import NoDogsMessage from '@/components/dogs/components/care/medications/components/NoDogsMessage';
import { SkeletonLoader } from '@/components/ui/standardized';

const MedicationsTab: React.FC<MedicationsTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const [filterFrequency, setFilterFrequency] = useState<string>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Add a small delay to create a nicer loading transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleFilterChange = (value: string) => {
    setFilterFrequency(value);
  };
  
  const renderMedicationHeader = () => {
    if (!dogStatuses) {
      return (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <MedicationHeader 
              title="Medication Tracking" 
              description="Track preventative medications and treatments for all dogs."
              isLoading={true}
            />
            <SkeletonLoader className="h-10 w-40" />
          </div>
        </div>
      );
    }
    
    if (dogStatuses.length === 0) return null;
    
    return (
      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <MedicationHeader 
            title="Medication Tracking" 
            description="Track preventative medications and treatments for all dogs."
          />
          <MedicationFilter 
            value={filterFrequency} 
            onChange={handleFilterChange}
          />
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (!dogStatuses) {
      return <SkeletonLoader variant="card" count={3} />;
    }
    
    if (dogStatuses.length === 0) {
      return <NoDogsMessage onRefresh={onRefreshDogs} />;
    }
    
    return (
      <MedicationsLog
        dogs={dogStatuses}
        onRefresh={onRefreshDogs}
      />
    );
  };
  
  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {renderMedicationHeader()}
      {renderContent()}
    </div>
  );
};

export default MedicationsTab;
