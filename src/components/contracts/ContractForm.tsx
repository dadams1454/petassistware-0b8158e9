
import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import CustomerSelector from './CustomerSelector';
import GenerateContractButton from './GenerateContractButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  contract_date: z.string().min(1, "Contract date is required"),
  contract_type: z.string().min(1, "Contract type is required"),
  price: z.number().min(0, "Price must be a positive number"),
  notes: z.string().optional(),
  payment_terms: z.string().optional(),
  template_id: z.string().optional(),
});

export type ContractFormData = z.infer<typeof formSchema>;

export interface ContractFormProps {
  puppyId: string;
  onSubmit: (data: ContractFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({
  puppyId,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  
  const form = useForm<ContractFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contract_date: new Date().toISOString().split('T')[0],
      contract_type: 'sale',
      price: 0,
      payment_terms: 'Full payment due at pickup',
    },
  });
  
  const { data: puppy } = useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      if (!puppyId) return null;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*, litters(*)')
        .eq('id', puppyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!puppyId
  });
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleGeneratePreview = async () => {
    if (!form.getValues('customer_id') || !puppyId) return;
    
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('id', form.getValues('customer_id'))
      .single();
      
    const { data: breederProfile } = await supabase
      .from('breeder_profiles')
      .select('*')
      .single();
    
    if (!customer || !breederProfile || !puppy) return;
    
    // Generate HTML preview using contractGenerator utility
    const contractData = {
      breederName: `${breederProfile.first_name} ${breederProfile.last_name}`,
      breederBusinessName: breederProfile.business_name || 'Not specified',
      customerName: `${customer.first_name} ${customer.last_name}`,
      puppyName: puppy.name,
      puppyDob: puppy.birth_date,
      salePrice: form.getValues('price'),
      contractDate: form.getValues('contract_date'),
      microchipNumber: puppy.microchip_number,
      paymentTerms: form.getValues('payment_terms')
    };
    
    // Import dynamically to avoid issues
    const { generateContractHTML } = await import('@/utils/contractGenerator');
    const html = generateContractHTML(contractData);
    setPreviewHtml(html);
    
    nextStep();
  };
  
  const handleSubmitContract = () => {
    onSubmit(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={`step-${currentStep}`} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="step-1" disabled={currentStep !== 1}>
              Customer Info
            </TabsTrigger>
            <TabsTrigger value="step-2" disabled={currentStep !== 2}>
              Contract Details
            </TabsTrigger>
            <TabsTrigger value="step-3" disabled={currentStep !== 3}>
              Review & Generate
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="step-1" className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <CustomerSelector form={form} />
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
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={nextStep} disabled={!form.watch('customer_id')}>
                Next
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="step-2" className="space-y-4">
            <FormField
              control={form.control}
              name="contract_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sale">Sale Agreement</SelectItem>
                      <SelectItem value="reservation">Reservation Agreement</SelectItem>
                      <SelectItem value="health_guarantee">Health Guarantee</SelectItem>
                      <SelectItem value="co_ownership">Co-Ownership Agreement</SelectItem>
                    </SelectContent>
                  </Select>
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
            
            <FormField
              control={form.control}
              name="payment_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe payment terms and schedule" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any additional terms or notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={handleGeneratePreview}>
                Preview Contract
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="step-3" className="space-y-4">
            {previewHtml && (
              <div className="border rounded-md p-4 max-h-[60vh] overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <div className="flex gap-2">
                <GenerateContractButton 
                  puppyId={puppyId}
                  customerId={form.getValues('customer_id')}
                />
                <Button type="button" onClick={handleSubmitContract} disabled={isLoading}>
                  Save Contract
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default ContractForm;
