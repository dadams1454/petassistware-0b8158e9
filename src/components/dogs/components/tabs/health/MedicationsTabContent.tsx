
import React from 'react';
import { EmptyState, LoadingState } from '@/components/ui/standardized';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useHealthTabContext } from './HealthTabContext';
import { HealthRecordTypeEnum } from '@/types/health';
import MedicationTracker from '../../health/MedicationTracker';

const MedicationsTabContent: React.FC = () => {
  const { 
    dogId,
    healthRecords, 
    isLoading, 
    getRecordsByType, 
    handleAddRecord,
    handleEditRecord 
  } = useHealthTabContext();
  
  const medications = getRecordsByType(HealthRecordTypeEnum.MEDICATION);
  
  if (isLoading) {
    return <LoadingState message="Loading medication records..." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={() => handleAddRecord(HealthRecordTypeEnum.MEDICATION)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </div>
      
      {/* Medication Tracker Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Medication Schedule</h3>
        <MedicationTracker dogId={dogId} />
      </div>
      
      {/* Medication Records */}
      <h3 className="text-lg font-medium mb-3">Medication History</h3>
      
      {medications.length === 0 ? (
        <EmptyState
          title="No medication records"
          description="Add your first medication record to keep track of your dog's medications."
          action={{
            label: "Add Medication",
            onClick: () => handleAddRecord(HealthRecordTypeEnum.MEDICATION)
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {medications.map(med => (
            <Card key={med.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEditRecord(med.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{med.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(med.visit_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  {med.medication_name && (
                    <p className="text-sm mb-1">
                      <span className="font-medium">Medication:</span> {med.medication_name}
                    </p>
                  )}
                  
                  {med.dosage && (
                    <p className="text-sm mb-1">
                      <span className="font-medium">Dosage:</span> {med.dosage} {med.dosage_unit || ''}
                    </p>
                  )}
                  
                  {med.frequency && (
                    <p className="text-sm mb-1">
                      <span className="font-medium">Frequency:</span> {med.frequency}
                    </p>
                  )}
                  
                  {med.next_due_date && (
                    <p className="text-sm mb-1 text-orange-700 dark:text-orange-400">
                      <span className="font-medium">Next Due:</span> {format(new Date(med.next_due_date), 'MMM d, yyyy')}
                    </p>
                  )}
                  
                  {med.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {med.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationsTabContent;
