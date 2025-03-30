
import React from 'react';
import { EmptyState, LoadingState } from '@/components/ui/standardized';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useHealthTabContext } from './HealthTabContext';
import { HealthRecordTypeEnum } from '@/types/health';

const MedicationsTabContent: React.FC = () => {
  const { 
    healthRecords, 
    isLoading, 
    getRecordsByType, 
    handleAddRecord,
    handleEditRecord 
  } = useHealthTabContext();
  
  const medications = getRecordsByType(HealthRecordTypeEnum.Medication);
  
  if (isLoading) {
    return <LoadingState message="Loading medication records..." />;
  }
  
  if (medications.length === 0) {
    return (
      <EmptyState
        title="No medication records"
        description="Add your first medication record to keep track of your dog's medications."
        action={{
          label: "Add Medication",
          onClick: () => handleAddRecord(HealthRecordTypeEnum.Medication)
        }}
      />
    );
  }
  
  // Sort medications by date (newest first)
  const sortedMedications = [...medications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => handleAddRecord(HealthRecordTypeEnum.Medication)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {sortedMedications.map(med => (
          <Card key={med.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleEditRecord(med.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{med.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(med.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {med.description || 'No details provided'}
                </p>
                {med.performed_by && (
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Administered by:</span> {med.performed_by}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicationsTabContent;
