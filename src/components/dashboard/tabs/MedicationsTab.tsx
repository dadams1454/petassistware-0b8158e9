
import React, { useState } from 'react';
import { MedicationsTabProps } from '@/components/dogs/components/care/medications/types/medicationTypes';
import MedicationsLog from '@/components/dogs/components/care/medications/MedicationsLog';
import MedicationFilter from '@/components/dogs/components/care/medications/components/MedicationFilter';
import MedicationHeader from '@/components/dogs/components/care/medications/components/MedicationHeader';
import NoDogsMessage from '@/components/dogs/components/care/medications/components/NoDogsMessage';

const MedicationsTab: React.FC<MedicationsTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const [filterFrequency, setFilterFrequency] = useState<string>("all");
  
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
    <>
      {renderMedicationHeader()}
      {renderContent()}
    </>
  );
};

export default MedicationsTab;
