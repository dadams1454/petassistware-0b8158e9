
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ExpenseFormValues } from '@/types/financial';
import { expenseFormSchema, ExpenseFormSchema } from './form/FormSchema';
import BasicFields from './form/BasicFields';
import CategoryField from './form/CategoryField';
import RelatedEntityFields from './form/RelatedEntityFields';
import NotesField from './form/NotesField';
import ReceiptUpload from './form/ReceiptUpload';
import FormActions from './form/FormActions';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormValues) => void;
  defaultValues?: Partial<ExpenseFormValues>;
  isSubmitting?: boolean;
  dogs?: { id: string; name: string }[];
  puppies?: { id: string; name: string }[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  dogs = [],
  puppies = [],
}) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  const form = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: defaultValues?.description || "",
      amount: defaultValues?.amount || 0,
      date: defaultValues?.date || new Date(),
      category: defaultValues?.category || "Food",
      notes: defaultValues?.notes || "",
      dog_id: defaultValues?.dog_id || undefined,
      puppy_id: defaultValues?.puppy_id || undefined,
    },
  });

  const handleSubmit = (values: ExpenseFormSchema) => {
    // Create a complete ExpenseFormValues object
    const formData: ExpenseFormValues = {
      description: values.description,
      amount: values.amount,
      date: values.date,
      category: values.category,
      notes: values.notes,
      dog_id: values.dog_id,
      puppy_id: values.puppy_id,
      receipt: receiptFile,
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicFields form={form} />
        <CategoryField form={form} />
        <RelatedEntityFields form={form} dogs={dogs} puppies={puppies} />
        <NotesField form={form} />
        <ReceiptUpload receiptFile={receiptFile} onFileChange={setReceiptFile} />
        <FormActions isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default ExpenseForm;
