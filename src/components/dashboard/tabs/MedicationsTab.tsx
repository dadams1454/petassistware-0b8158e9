
import React, { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import MedicationsLog from '@/components/dogs/components/care/medications/MedicationsLog';
import MedicationFilter from '@/components/dogs/components/care/medications/components/MedicationFilter';
import MedicationHeader from '@/components/dogs/components/care/medications/components/MedicationHeader';
import NoDogsMessage from '@/components/dogs/components/care/medications/components/NoDogsMessage';
import { SkeletonLoader } from '@/components/ui/standardized';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill } from 'lucide-react';

interface MedicationsTabProps {
  dogStatuses?: DogCareStatus[];
  onRefreshDogs: () => void;
}

const MedicationsTab: React.FC<MedicationsTabProps> = ({ 
  dogStatuses = [],
  onRefreshDogs 
}) => {
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
    if (!dogStatuses || dogStatuses.length === 0) return null;
    
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
    if (!dogStatuses || dogStatuses.length === 0) {
      return (
        <Card className="p-8 text-center">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Pill className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Dogs Found</h3>
              <p className="text-muted-foreground mb-4">Add dogs to start tracking medications</p>
              <Button onClick={onRefreshDogs} variant="outline">Refresh Dogs</Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <MedicationsLog
        dogs={dogStatuses}
        onRefresh={onRefreshDogs}
      />
    );
  };
  
  // Check if dogStatuses is actually an array
  const hasDogs = Array.isArray(dogStatuses) && dogStatuses.length > 0;
  
  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Medication Schedule</h2>
        <p className="text-muted-foreground mb-4">Track and manage all medications for your dogs</p>
      </div>
      
      {renderMedicationHeader()}
      {renderContent()}
    </div>
  );
};

export default MedicationsTab;
