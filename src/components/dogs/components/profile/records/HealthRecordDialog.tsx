
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';

interface HealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  recordType: HealthRecordTypeEnum;
  recordId?: string;
  onSave: (data: HealthRecord) => void;
}

const HealthRecordDialog: React.FC<HealthRecordDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  recordType,
  recordId,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [visitDate, setVisitDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [vetName, setVetName] = useState('');
  const [description, setDescription] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  
  useEffect(() => {
    // Reset form when dialog opens for a new record
    if (open && !recordId) {
      resetForm();
    }
  }, [open, recordId]);
  
  const resetForm = () => {
    setTitle('');
    setVisitDate(format(new Date(), 'yyyy-MM-dd'));
    setVetName('');
    setDescription('');
    setNextDueDate('');
    setPerformedBy('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recordId) {
      // Update existing record
      const healthRecord: HealthRecord = {
        id: recordId,
        dog_id: dogId,
        visit_date: visitDate,
        date: visitDate, // For compatibility
        record_type: recordType,
        title: title,
        description: description,
        performed_by: performedBy,
        vet_name: vetName,
        next_due_date: nextDueDate || undefined,
        created_at: new Date().toISOString()
      };
      
      onSave(healthRecord);
    } else {
      // Create new record
      const healthRecord: HealthRecord = {
        dog_id: dogId,
        visit_date: visitDate,
        date: visitDate, // For compatibility
        record_type: recordType,
        title: title,
        description: description,
        performed_by: performedBy,
        vet_name: vetName,
        next_due_date: nextDueDate || undefined,
        created_at: new Date().toISOString()
      };
      
      onSave(healthRecord);
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {recordId ? 'Edit Health Record' : 'Add Health Record'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title for the record"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visitDate">Visit Date</Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vetName">Veterinarian</Label>
              <Input
                id="vetName"
                value={vetName}
                onChange={(e) => setVetName(e.target.value)}
                placeholder="Veterinarian name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nextDueDate">Next Due Date</Label>
              <Input
                id="nextDueDate"
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                min={visitDate}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="performedBy">Performed By</Label>
            <Input
              id="performedBy"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              placeholder="Person who performed this procedure"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about the health record"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {recordId ? 'Update Record' : 'Save Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
