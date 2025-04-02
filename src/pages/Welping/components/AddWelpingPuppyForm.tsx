
import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddWelpingPuppyFormProps {
  litterId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birthOrder: number;
  birthWeight: string;
  birthTime: string;
  presentation: string;
  assistanceRequired: boolean;
  assistanceNotes: string;
}

const AddWelpingPuppyForm: React.FC<AddWelpingPuppyFormProps> = ({ 
  litterId, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      gender: 'Male',
      color: '',
      birthOrder: 1,
      birthWeight: '',
      birthTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      presentation: 'Normal',
      assistanceRequired: false,
      assistanceNotes: '',
    }
  });
  
  const assistanceRequired = form.watch('assistanceRequired');
  
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get current date for birth date
      const birthDate = new Date().toISOString().split('T')[0];
      
      // Insert the puppy record
      const { data, error } = await supabase
        .from('puppies')
        .insert({
          litter_id: litterId,
          name: values.name,
          gender: values.gender,
          color: values.color,
          birth_date: birthDate,
          birth_order: values.birthOrder,
          birth_weight: values.birthWeight,
          birth_time: values.birthTime,
          presentation: values.presentation,
          assistance_required: values.assistanceRequired,
          assistance_notes: values.assistanceRequired ? values.assistanceNotes : null,
          status: 'Available'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Also log this in the welping_logs table if it exists
      try {
        await supabase
          .from('welping_logs')
          .insert({
            litter_id: litterId,
            timestamp: new Date().toISOString(),
            event_type: 'puppy_born',
            puppy_id: data.id,
            notes: `${values.gender} puppy born (${values.color})`,
            puppy_details: {
              gender: values.gender,
              color: values.color,
              weight: values.birthWeight
            }
          });
      } catch (logError) {
        // If the welping_logs table doesn't exist, just continue
        console.log('Could not log to welping_logs (table may not exist)', logError);
      }
      
      // Update the puppy count in the litter
      // First, get the current counts
      const { data: litterData, error: litterError } = await supabase
        .from('litters')
        .select('male_count, female_count')
        .eq('id', litterId)
        .single();
        
      if (!litterError && litterData) {
        const maleCount = litterData.male_count || 0;
        const femaleCount = litterData.female_count || 0;
        
        // Update the appropriate count
        if (values.gender === 'Male') {
          await supabase
            .from('litters')
            .update({ male_count: maleCount + 1 })
            .eq('id', litterId);
        } else {
          await supabase
            .from('litters')
            .update({ female_count: femaleCount + 1 })
            .eq('id', litterId);
        }
      }
      
      toast({
        title: 'Puppy recorded',
        description: `Successfully recorded puppy ${values.name || '#' + values.birthOrder}`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error adding puppy:', error);
      toast({
        title: 'Error',
        description: 'Failed to add puppy',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Puppy name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="Puppy color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
            name="birthWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Weight (oz)</FormLabel>
                <FormControl>
                  <Input placeholder="Weight in ounces" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="presentation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presentation</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select presentation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Breech">Breech</SelectItem>
                  <SelectItem value="Shoulder">Shoulder</SelectItem>
                  <SelectItem value="Side">Side</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="assistanceRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Assistance Required?</FormLabel>
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
        
        {assistanceRequired && (
          <FormField
            control={form.control}
            name="assistanceNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assistance Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the assistance provided"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Add Puppy'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddWelpingPuppyForm;
