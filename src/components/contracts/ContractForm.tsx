import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomerSelector from './CustomerSelector';
import GenerateContractButton from './GenerateContractButton';

const formSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  contract_date: z.string().min(1, "Contract date is required"),
  contract_type: z.string().optional(),
  price: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export interface ContractFormProps {
  puppyId: string;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({
  puppyId,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contract_date: new Date().toISOString().split('T')[0],
      contract_type: 'sale',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <FormControl>
                <CustomerSelector
                  form={form}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contract_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              Create Contract
            </Button>
            {form.watch('customer_id') && (
              <GenerateContractButton 
                puppyId={puppyId}
                customerId={form.watch('customer_id')}
              />
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ContractForm;
