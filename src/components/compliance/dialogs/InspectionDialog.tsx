
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useInspectionForm } from './inspection/useInspectionForm';
import InspectionFormFields from './inspection/InspectionFormFields';

interface InspectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (inspection: any) => void;
  inspection?: any;
}

const InspectionDialog: React.FC<InspectionDialogProps> = ({ 
  isOpen, 
  onClose,
  onSave,
  inspection
}) => {
  const { form, handleSubmit } = useInspectionForm({ inspection, onSave });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{inspection ? 'Edit Inspection' : 'Add Inspection'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InspectionFormFields form={form} />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{inspection ? 'Update' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDialog;
