
import React from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Form } from "@/components/ui/form";
import { useCustomerForm } from './hooks/useCustomerForm';
import PersonalInfoFields from './form-fields/PersonalInfoFields';
import AddressField from './form-fields/AddressField';
import CustomerTypeFields from './form-fields/CustomerTypeFields';
import LitterSelectionFields from './form-fields/LitterSelectionFields';
import InterestedPuppyField from './form-fields/InterestedPuppyField';
import NotesField from './form-fields/NotesField';
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
  customer?: Customer | null;
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
        <PersonalInfoFields />
        <AddressField />
        <CustomerTypeFields />
        <LitterSelectionFields />
        <InterestedPuppyField />
        <NotesField />
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
