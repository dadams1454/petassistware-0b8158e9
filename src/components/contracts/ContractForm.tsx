
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthProvider';
import { ContractFormSchema, ContractFormValues, contractTypeOptions, ContractFormProps } from './types';
import { createContract } from '@/services/contractService';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import DatePicker from '@/components/dogs/form/DatePicker';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import CheckboxInput from '@/components/dogs/form/CheckboxInput';
import CustomerSelector from './CustomerSelector';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const ContractForm: React.FC<ContractFormProps> = ({ 
  puppyId,
  customerId,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues: Partial<ContractFormValues> = {
    breeder_id: user?.id || '',
    puppy_id: puppyId || null,
    customer_id: customerId || null,
    contract_date: new Date(),
    contract_dateStr: format(new Date(), 'MM/dd/yyyy'),
    contract_type: 'purchase',
    price: null,
    signed: false,
    notes: null
  };

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(ContractFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ContractFormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a contract');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createContract({
        breeder_id: user.id,
        contract_date: data.contract_date ? format(data.contract_date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        contract_type: data.contract_type,
        puppy_id: data.puppy_id,
        customer_id: data.customer_id,
        price: data.price,
        signed: data.signed || false,
        notes: data.notes,
        document_url: null
      });
      
      toast.success('Contract created successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('Failed to create contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create Contract</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                form={form}
                name="contract_type"
                label="Contract Type"
                options={contractTypeOptions}
              />
              
              <DatePicker
                form={form}
                name="contract_date"
                label="Contract Date"
              />
            </div>
            
            <CustomerSelector 
              form={form} 
              defaultValue={customerId}
            />
            
            <TextInput
              form={form}
              name="price"
              label="Price"
              placeholder="Enter price amount"
            />
            
            <TextareaInput
              form={form}
              name="notes"
              label="Notes"
              placeholder="Enter any additional notes about this contract"
            />
            
            <CheckboxInput
              form={form}
              name="signed"
              label="Contract is signed"
            />
            
            <div className="flex justify-end gap-4 mt-6">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Contract'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContractForm;
