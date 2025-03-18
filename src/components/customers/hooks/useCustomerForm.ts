
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { Customer } from '../types/customer';
import { customerFormSchema, CustomerFormValues } from '../schemas/customerFormSchema';
import { getDefaultFormValues } from './customerForm/formValueUtils';
import { useCustomerSubmit } from './customerForm/useCustomerSubmit';

interface UseCustomerFormProps {
  customer?: Customer;
  onSubmitSuccess: () => void;
}

export const useCustomerForm = ({ customer, onSubmitSuccess }: UseCustomerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with default values from the customer if provided
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: getDefaultFormValues(customer),
  });

  // Use the submission hook
  const { submitCustomerForm } = useCustomerSubmit();

  const handleSubmit = async (values: CustomerFormValues) => {
    setIsLoading(true);
    try {
      console.log("Form submit started with values:", values);
      
      await submitCustomerForm(values, customer);
      
      toast({
        title: customer ? "Customer updated" : "Customer added",
        description: `${values.first_name} ${values.last_name} has been ${customer ? 'updated' : 'added'}.`,
      });
      
      onSubmitSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Customer form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
    isEditMode: !!customer,
  };
};
