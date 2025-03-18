
import React from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Form } from "@/components/ui/form";
import { useCustomerForm } from './hooks/useCustomerForm';
import FormSections from './form-sections/FormSections';
import FormActions from './form-fields/FormActions';

type Customer = Tables<'customers'> & {
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
    interested_litter_id?: string;
    waitlist_type?: 'specific' | 'open';
  }
};

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: () => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onCancel,
}) => {
  const { form, isLoading, handleSubmit, isEditMode } = useCustomerForm({
    customer,
    onSubmitSuccess: onSubmit,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSections />
        <FormActions 
          onCancel={onCancel} 
          isLoading={isLoading} 
          isEditMode={isEditMode} 
        />
      </form>
    </Form>
  );
};

export default CustomerForm;
