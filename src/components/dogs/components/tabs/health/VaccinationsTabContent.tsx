
import React from 'react';
import { useHealthTabContext } from './HealthTabContext';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Syringe } from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';
import HealthRecordsList from '@/components/dogs/components/profile/records/HealthRecordsList';
import HealthRecordForm from '@/components/dogs/components/profile/records/HealthRecordForm';

export interface VaccinationsTabContentProps {
  dogId: string;
}

const VaccinationsTabContent: React.FC<VaccinationsTabContentProps> = ({ dogId }) => {
  const { 
    healthRecords, 
    isLoading, 
    error, 
    setShowAddRecordDialog, 
    setRecordToEdit,
    setRecordToDelete,
    setSelectedRecordType 
  } = useHealthTabContext();
  
  // Filter for vaccination records
  const vaccinationRecords = healthRecords.filter(
    record => record.record_type === HealthRecordTypeEnum.Vaccination
  );

  const handleAddVaccination = () => {
    setSelectedRecordType(HealthRecordTypeEnum.Vaccination);
    setShowAddRecordDialog(true);
  };

  if (isLoading) {
    return <LoadingState message="Loading vaccination records..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error Loading Records"
        message={error instanceof Error ? error.message : String(error)}
      />
    );
  }

  if (vaccinationRecords.length === 0) {
    return (
      <EmptyState
        icon={<Syringe className="h-12 w-12 text-muted-foreground" />}
        title="No Vaccination Records"
        description="Add your dog's vaccination records to keep track of their health history."
        action={
          <Button onClick={handleAddVaccination}>
            Add Vaccination
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vaccinations</h3>
        <Button onClick={handleAddVaccination}>
          Add Vaccination
        </Button>
      </div>
      
      <HealthRecordsList
        records={vaccinationRecords}
        recordType={HealthRecordTypeEnum.Vaccination}
        emptyMessage="No vaccination records found."
      />
    </div>
  );
};

export default VaccinationsTabContent;
