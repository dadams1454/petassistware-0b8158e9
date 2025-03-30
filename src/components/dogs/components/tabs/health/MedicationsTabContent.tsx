
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import { ActionButton } from '@/components/ui/standardized';
import HealthRecordsList from '../../health/HealthRecordsList';
import { useHealthTabContext } from './HealthTabContext';

const MedicationsTabContent: React.FC = () => {
  const {
    getRecordsByType,
    handleAddRecord,
    handleEditRecord,
    deleteHealthRecord,
    isLoading
  } = useHealthTabContext();

  const medications = getRecordsByType('medication');

  if (medications.length === 0) {
    return (
      <EmptyState
        title="No medication records"
        description="Track medications, supplements, and treatments by adding medication records."
        action={{
          label: "Add Medication",
          onClick: () => handleAddRecord('medication')
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Medication Records</CardTitle>
        <ActionButton
          size="sm"
          onClick={() => handleAddRecord('medication')}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Medication
        </ActionButton>
      </CardHeader>
      <CardContent>
        <HealthRecordsList 
          records={medications}
          onEdit={handleEditRecord}
          onDelete={deleteHealthRecord}
          emptyMessage="No medication records found"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default MedicationsTabContent;
