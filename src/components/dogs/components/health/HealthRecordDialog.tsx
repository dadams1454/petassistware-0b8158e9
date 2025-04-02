
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HealthRecordTypeEnum, HealthRecord } from '@/types/health';
import HealthRecordForm from './HealthRecordForm';
import { useHealthRecords } from '@/components/dogs/hooks/useHealthRecords';

interface HealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  recordType?: HealthRecordTypeEnum;
  recordId?: string;
  onSave: (data: any) => void; // Updated the type to accept a parameter
}

const HealthRecordDialog: React.FC<HealthRecordDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  recordType,
  recordId,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordData, setRecordData] = useState<HealthRecord | null>(null);
  
  const { 
    healthRecords,
    addHealthRecord,
    updateHealthRecord,
    isAdding,
    isUpdating
  } = useHealthRecords(dogId);
  
  // Fetch the record data if editing an existing record
  useEffect(() => {
    if (open && recordId && healthRecords) {
      const record = healthRecords.find(r => r.id === recordId);
      if (record) {
        setRecordData(record);
      }
    } else {
      // Reset data when opening a new record
      if (open && !recordId) {
        setRecordData(null);
      }
    }
  }, [open, recordId, healthRecords]);
  
  const handleSave = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (recordId) {
        // Update existing record
        await updateHealthRecord({
          id: recordId,
          ...data
        });
      } else {
        // Add new record
        await addHealthRecord(data);
      }
      
      onSave(data); // Pass data to the parent component
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save health record');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {recordId ? 'Edit Health Record' : 'Add Health Record'}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <HealthRecordForm 
          dogId={dogId}
          recordType={recordType}
          recordId={recordId}
          initialData={recordData}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
