
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Litter } from '../types';

interface WelpingEditFormProps {
  litter: Litter;
  onSave: (data: any) => Promise<void>;
}

const WelpingEditForm: React.FC<WelpingEditFormProps> = ({ litter, onSave }) => {
  const form = useForm({
    defaultValues: {
      litterName: litter.litter_name || '',
      birthDate: new Date(litter.birth_date),
      damId: litter.dam_id,
      sireId: litter.sire_id || '',
      expectedGoHomeDate: litter.expected_go_home_date ? new Date(litter.expected_go_home_date) : undefined,
      notes: litter.notes || '',
      akcLitterNumber: litter.akc_litter_number || ''
    }
  });
  
  // Fetch available dams
  const { data: femaleDogs } = useQuery({
    queryKey: ['female-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed')
        .eq('gender', 'Female')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch available sires
  const { data: maleDogs } = useQuery({
    queryKey: ['male-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed')
        .eq('gender', 'Male')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const handleSubmit = async (data: any) => {
    await onSave(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="litterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Litter Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="E.g., Spring 2023 Litter" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    popoverTrigger={
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      </Button>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expectedGoHomeDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Go-Home Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    popoverTrigger={
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      </Button>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="damId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dam (Mother)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a female dog" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {femaleDogs?.map(dog => (
                      <SelectItem key={dog.id} value={dog.id}>
                        {dog.name} ({dog.breed || 'Unknown breed'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sireId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sire (Father)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a male dog" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None Selected</SelectItem>
                    {maleDogs?.map(dog => (
                      <SelectItem key={dog.id} value={dog.id}>
                        {dog.name} ({dog.breed || 'Unknown breed'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="akcLitterNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AKC Litter Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="AKC Litter Registration Number" />
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
                  {...field} 
                  rows={4}
                  placeholder="Any additional details about this litter" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default WelpingEditForm;
