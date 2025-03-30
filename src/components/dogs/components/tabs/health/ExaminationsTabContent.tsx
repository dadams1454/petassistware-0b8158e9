
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import { ActionButton } from '@/components/ui/standardized';
import HealthRecordsList from '../../health/HealthRecordsList';
import { useHealthTabContext } from './HealthTabContext';

const ExaminationsTabContent: React.FC = () => {
  const {
    getRecordsByType,
    handleAddRecord,
    handleEditRecord,
    deleteHealthRecord,
    isLoading
  } = useHealthTabContext();

  const examinations = getRecordsByType('examination');

  if (examinations.length === 0) {
    return (
      <EmptyState
        title="No examination records"
        description="Keep track of vet visits and health check-ups by adding examination records."
        action={{
          label: "Add Examination",
          onClick: () => handleAddRecord('examination')
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Examination Records</CardTitle>
        <ActionButton
          size="sm"
          onClick={() => handleAddRecord('examination')}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Examination
        </ActionButton>
      </CardHeader>
      <CardContent>
        <HealthRecordsList 
          records={examinations}
          onEdit={handleEditRecord}
          onDelete={deleteHealthRecord}
          emptyMessage="No examination records found"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default ExaminationsTabContent;
