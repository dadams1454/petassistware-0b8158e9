
import React from 'react';
import { useHealthTabContext } from './HealthTabContext';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';
import HealthRecordsList from '@/components/dogs/components/profile/records/HealthRecordsList';

export interface ExaminationsTabContentProps {
  dogId: string;
}

const ExaminationsTabContent: React.FC<ExaminationsTabContentProps> = ({ dogId }) => {
  const { 
    healthRecords, 
    isLoading, 
    error, 
    openAddExaminationDialog 
  } = useHealthTabContext();
  
  // Filter for examination records
  const examinationRecords = healthRecords.filter(
    record => record.record_type === HealthRecordTypeEnum.Examination
  );

  if (isLoading) {
    return <LoadingState message="Loading examination records..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error Loading Records"
        message={error instanceof Error ? error.message : String(error)}
      />
    );
  }

  if (examinationRecords.length === 0) {
    return (
      <EmptyState
        icon={<Stethoscope className="h-12 w-12 text-muted-foreground" />}
        title="No Examination Records"
        description="Add your dog's examination records to keep track of their health history."
        action={
          <Button onClick={openAddExaminationDialog}>
            Add Examination
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Examinations</h3>
        <Button onClick={openAddExaminationDialog}>
          Add Examination
        </Button>
      </div>
      
      <HealthRecordsList
        records={examinationRecords}
        recordType={HealthRecordTypeEnum.Examination}
        emptyMessage="No examination records found."
      />
    </div>
  );
};

export default ExaminationsTabContent;
