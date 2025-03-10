
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { WaitlistEntry } from './types';
import { useWaitlistEntryForm } from './hooks/useWaitlistEntryForm';
import WaitlistFormFields from './components/WaitlistFormFields';

interface WaitlistEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  litterId: string;
  entry?: WaitlistEntry | null;
  onSuccess: () => void;
}

const WaitlistEntryDialog: React.FC<WaitlistEntryDialogProps> = ({
  open,
  onOpenChange,
  litterId,
  entry,
  onSuccess,
}) => {
  const {
    form,
    colorOptions,
    selectedCustomer,
    isSubmitting,
    handleCustomerSelected,
    onSubmit
  } = useWaitlistEntryForm({
    litterId,
    entry: entry || null,
    onSuccess,
    onOpenChange
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Edit Waitlist Entry' : 'Add to Waitlist'}
          </DialogTitle>
          <DialogDescription>
            {entry
              ? 'Update the waitlist entry information'
              : 'Add a customer to the waitlist for this litter'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <WaitlistFormFields
              form={form}
              selectedCustomer={selectedCustomer}
              handleCustomerSelected={handleCustomerSelected}
              colorOptions={colorOptions}
              readOnlyCustomer={!!entry}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : entry ? 'Update' : 'Add to Waitlist'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistEntryDialog;
