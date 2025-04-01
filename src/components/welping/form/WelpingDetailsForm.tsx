
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { createWelpingRecord, updateWelpingRecord, WelpingRecord } from '@/services/welpingService';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

const welpingFormSchema = z.object({
  birth_date: z.string().min(1, 'Birth date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().optional(),
  total_puppies: z.number().min(0, 'Total puppies must be a non-negative number'),
  males: z.number().min(0, 'Males must be a non-negative number'),
  females: z.number().min(0, 'Females must be a non-negative number'),
  notes: z.string().optional(),
  attended_by: z.string().optional(),
  complications: z.boolean().default(false),
  complication_notes: z.string().optional(),
  status: z.enum(['in-progress', 'completed']).default('in-progress'),
});

type WelpingFormValues = z.infer<typeof welpingFormSchema>;

interface WelpingDetailsFormProps {
  litterId: string;
  initialData?: WelpingRecord;
  onSuccess: () => void;
}

const WelpingDetailsForm: React.FC<WelpingDetailsFormProps> = ({
  litterId,
  initialData,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const defaultValues: Partial<WelpingFormValues> = initialData ? {
    birth_date: initialData.birth_date,
    start_time: initialData.start_time,
    end_time: initialData.end_time || '',
    total_puppies: initialData.total_puppies,
    males: initialData.males,
    females: initialData.females,
    notes: initialData.notes || '',
    attended_by: initialData.attended_by || '',
    complications: initialData.complications || false,
    complication_notes: initialData.complication_notes || '',
    status: initialData.status,
  } : {
    birth_date: new Date().toISOString().split('T')[0],
    start_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    total_puppies: 0,
    males: 0,
    females: 0,
    complications: false,
    status: 'in-progress',
  };

  const form = useForm<WelpingFormValues>({
    resolver: zodResolver(welpingFormSchema),
    defaultValues,
  });
  
  const handleSubmitForm = async (values: WelpingFormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        // Update existing record
        await updateWelpingRecord(initialData.id, {
          ...values,
          litter_id: litterId,
        });
        toast({
          title: 'Success',
          description: 'Whelping details updated successfully',
        });
      } else {
        // Create new record
        await createWelpingRecord(litterId, {
          ...values,
          litter_id: litterId,
        });
        toast({
          title: 'Success',
          description: 'Whelping details recorded successfully',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting whelping details:', error);
      toast({
        title: 'Error',
        description: 'Failed to save whelping details',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)}>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Whelping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="total_puppies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Puppies</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="males"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Males</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="females"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Females</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="attended_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attended By</FormLabel>
                      <FormControl>
                        <Input placeholder="Names of people attending the whelping" {...field} />
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
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="General notes about the whelping process"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          When the whelping process was completed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          Current status of the whelping process
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="complications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Complications
                        </FormLabel>
                        <FormDescription>
                          Were there any complications during whelping?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch('complications') && (
                  <FormField
                    control={form.control}
                    name="complication_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complication Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe any complications that occurred during whelping"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Details' : 'Record Whelping Details'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WelpingDetailsForm;
