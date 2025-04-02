
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface WelpingLogFormProps {
  litterId: string;
  onSave: (data: any) => Promise<void>;
}

const WelpingLogForm: React.FC<WelpingLogFormProps> = ({ litterId, onSave }) => {
  const form = useForm({
    defaultValues: {
      time: format(new Date(), 'HH:mm'),
      type: 'observation',
      description: '',
      action: '',
      puppyId: ''
    }
  });
  
  // Fetch puppies for this litter
  const { data: puppies } = useQuery({
    queryKey: ['puppies', litterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppies')
        .select('id, name, color, gender')
        .eq('litter_id', litterId)
        .order('birth_order', { ascending: true });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!litterId
  });
  
  const logTypes = [
    { value: 'observation', label: 'General Observation' },
    { value: 'contraction', label: 'Contraction' },
    { value: 'birth', label: 'Puppy Birth' },
    { value: 'complication', label: 'Complication' },
    { value: 'medication', label: 'Medication Given' },
    { value: 'temperature', label: 'Temperature Reading' },
    { value: 'intervention', label: 'Medical Intervention' }
  ];
  
  const handleSubmit = async (data: any) => {
    await onSave(data);
    form.reset({
      time: format(new Date(), 'HH:mm'),
      type: 'observation',
      description: '',
      action: '',
      puppyId: ''
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {logTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch('type') === 'birth' && (
          <FormField
            control={form.control}
            name="puppyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puppy</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select puppy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {puppies?.map(puppy => (
                      <SelectItem key={puppy.id} value={puppy.id}>
                        {puppy.name} ({puppy.color}, {puppy.gender})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={3}
                  placeholder="Describe what happened" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Taken (if any)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={2}
                  placeholder="Describe any actions taken" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">Add Log Entry</Button>
        </div>
      </form>
    </Form>
  );
};

export default WelpingLogForm;
