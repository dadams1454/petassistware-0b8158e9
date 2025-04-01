
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { WelpingRecord, createWelpingRecord, updateWelpingRecord } from '@/services/welpingService';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface WelpingDetailsFormProps {
  litterId: string;
  initialData?: WelpingRecord | null;
  onSuccess?: () => void;
}

const WelpingDetailsForm: React.FC<WelpingDetailsFormProps> = ({
  litterId,
  initialData,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentTime = format(new Date(), 'HH:mm');
  
  const form = useForm({
    defaultValues: {
      birth_date: initialData?.birth_date || today,
      start_time: initialData?.start_time || currentTime,
      end_time: initialData?.end_time || '',
      total_puppies: initialData?.total_puppies || 0,
      males: initialData?.males || 0,
      females: initialData?.females || 0,
      attended_by: initialData?.attended_by || '',
      notes: initialData?.notes || '',
      complications: initialData?.complications || false,
      complication_notes: initialData?.complication_notes || '',
      status: initialData?.status || 'in-progress'
    }
  });
  
  const watchComplications = form.watch('complications');
  
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // Ensure status is included
      const data = {
        ...values,
        status: values.end_time ? 'completed' : 'in-progress',
        litter_id: litterId
      };
      
      let result;
      
      if (initialData?.id) {
        // Update existing record
        result = await updateWelpingRecord(initialData.id, data);
      } else {
        // Create new record
        result = await createWelpingRecord(litterId, data);
      }
      
      if (result) {
        toast({
          title: 'Success',
          description: initialData?.id ? 'Whelping details updated successfully' : 'Whelping details recorded successfully'
        });
        
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error saving whelping details:', error);
      toast({
        title: 'Error',
        description: 'Failed to save whelping details',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time (when completed)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>
                      Leave blank if whelping is still in progress
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="attended_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attended By</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of person attending the whelping" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                        onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        value={field.value || 0}
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
                    <FormLabel>Male Puppies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        value={field.value || 0}
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
                    <FormLabel>Female Puppies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="complications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Complications?</FormLabel>
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
            </div>
            
            {watchComplications && (
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="complication_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complication Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any complications during whelping..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about the whelping process..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Details' : 'Save Details'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WelpingDetailsForm;
