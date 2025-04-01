
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HealthRecord } from '@/types/dog';
import { useDogHealthRecords } from '@/hooks/useDogHealthRecords';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { Plus, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HealthAlertPanel } from '@/components/health/HealthAlertPanel';
import AddHealthRecordForm from '../forms/AddHealthRecordForm';

interface DogHealthRecordsProps {
  dogId: string;
}

const DogHealthRecords: React.FC<DogHealthRecordsProps> = ({ dogId }) => {
  const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
  const { healthRecords, isLoading, error, refresh, addHealthRecord } = useDogHealthRecords(dogId);
  
  const handleAddRecord = async (recordData: Partial<HealthRecord>) => {
    try {
      await addHealthRecord({
        ...recordData,
        dog_id: dogId
      });
      setShowAddRecordDialog(false);
    } catch (error) {
      console.error('Error adding health record:', error);
    }
  };
  
  if (isLoading) {
    return <LoadingState message="Loading health records..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="Error Loading Health Records" 
        message={(error as Error).message}
        onRetry={refresh}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Health Records</h2>
        <Button onClick={() => setShowAddRecordDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </div>
      
      <HealthAlertPanel dogId={dogId} />
      
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>
            View all health examinations, vaccinations, and procedures
          </CardDescription>
        </CardHeader>
        <CardContent>
          {healthRecords.length > 0 ? (
            <div className="space-y-4">
              {healthRecords.map((record) => (
                <div key={record.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{record.title || record.record_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.visit_date).toLocaleDateString()}
                        {record.vet_name && ` • ${record.vet_name}`}
                      </p>
                    </div>
                    <div className="text-sm">
                      {record.next_due_date && (
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">Next: </span>
                          <span className="font-medium">{new Date(record.next_due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {record.record_notes && (
                    <p className="mt-2 text-sm">{record.record_notes}</p>
                  )}
                  
                  {record.document_url && (
                    <div className="mt-2">
                      <a 
                        href={record.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Health Records</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking health information by adding a record.
              </p>
              <Button onClick={() => setShowAddRecordDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add First Record
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showAddRecordDialog} onOpenChange={setShowAddRecordDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Health Record</DialogTitle>
          </DialogHeader>
          <AddHealthRecordForm 
            onSubmit={handleAddRecord}
            onCancel={() => setShowAddRecordDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogHealthRecords;
