
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ExpenseForm from './ExpenseForm';
import { ExpenseFormValues } from '@/types/financial';

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ExpenseFormValues) => void;
  defaultValues?: Partial<ExpenseFormValues>;
  isSubmitting?: boolean;
  title?: string;
  dogs?: { id: string; name: string }[];
  puppies?: { id: string; name: string }[];
}

const ExpenseDialog: React.FC<ExpenseDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  defaultValues,
  isSubmitting = false,
  title = 'Add Expense',
  dogs = [],
  puppies = [],
}) => {
  const handleSubmit = async (values: ExpenseFormValues) => {
    await onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          dogs={dogs}
          puppies={puppies}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
