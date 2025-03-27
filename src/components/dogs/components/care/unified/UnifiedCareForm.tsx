
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { careCategories } from '@/components/dogs/components/care/CareCategories';
import { useCareRecords } from '@/contexts/careRecords';
import { CareCategory } from '@/types/careRecord';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Form validation schema
const careFormSchema = z.object({
  category: z.string().min(1, { message: 'Please select a category' }),
  task_name: z.string().min(1, { message: 'Please enter a task name' }),
  timestamp: z.date({
    required_error: 'Please select a date and time',
  }),
  notes: z.string().optional(),
  status: z.enum(['completed', 'scheduled', 'missed']).default('completed'),
  assigned_to: z.string().optional(),
  follow_up_needed: z.boolean().default(false),
  follow_up_notes: z.string().optional(),
  follow_up_date: z.date().optional().nullable(),
});

type CareFormValues = z.infer<typeof careFormSchema>;

interface UnifiedCareFormProps {
  dogId: string;
  initialCategory?: CareCategory;
  onSuccess?: () => void;
  recordId?: string; // If provided, we're updating an existing record
  initialValues?: Partial<CareFormValues>;
}

const UnifiedCareForm: React.FC<UnifiedCareFormProps> = ({ 
  dogId, 
  initialCategory,
  onSuccess,
  recordId,
  initialValues = {}
}) => {
  const { createCareRecord, updateCareRecord, loading } = useCareRecords();
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<CareFormValues>({
    resolver: zodResolver(careFormSchema),
    defaultValues: {
      category: initialCategory || 'pottybreaks',
      task_name: '',
      timestamp: new Date(),
      notes: '',
      status: 'completed',
      assigned_to: '',
      follow_up_needed: false,
      follow_up_notes: '',
      follow_up_date: null,
      ...initialValues
    }
  });
  
  // Update form values if initialValues changes
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      form.reset({
        ...form.getValues(),
        ...initialValues
      });
    }
  }, [initialValues, form]);
  
  const watchFollowUpNeeded = form.watch('follow_up_needed');
  const watchStatus = form.watch('status');
  
  // Handle form submission
  const onSubmit = async (values: CareFormValues) => {
    try {
      const formData = {
        dog_id: dogId,
        category: values.category as CareCategory,
        task_name: values.task_name,
        timestamp: values.timestamp,
        notes: values.notes,
        status: values.status,
        assigned_to: values.assigned_to,
        follow_up_needed: values.follow_up_needed,
        follow_up_notes: values.follow_up_notes,
        // Only include follow_up_date if follow_up_needed is true
        follow_up_date: values.follow_up_needed ? values.follow_up_date : undefined,
      };
      
      let result;
      
      if (recordId) {
        // Update existing record
        result = await updateCareRecord(recordId, formData);
      } else {
        // Create new record
        result = await createCareRecord(formData);
      }
      
      if (result) {
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error submitting care form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save care record',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {recordId ? 'Update Care Record' : 'Add Care Record'}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Category Selection */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select care category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {careCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Task Name */}
          <FormField
            control={form.control}
            name="task_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter task name" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Date and Time */}
          <FormField
            control={form.control}
            name="timestamp"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date and Time</FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[200px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={loading}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = new Date(field.value);
                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            field.onChange(newDate);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <FormControl>
                    <Input
                      type="time"
                      className="w-[150px]"
                      value={field.value ? format(field.value, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':').map(Number);
                        const newDate = new Date(field.value);
                        newDate.setHours(hours, minutes);
                        field.onChange(newDate);
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Status Selection */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Staff Assignment (only shown for scheduled tasks) */}
          {watchStatus === 'scheduled' && (
            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter staff name" 
                      {...field} 
                      value={field.value || ''}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter notes" 
                    className="min-h-[80px]" 
                    {...field} 
                    value={field.value || ''}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Follow-up Toggle */}
          <FormField
            control={form.control}
            name="follow_up_needed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Requires Follow-up</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          {/* Follow-up Fields (only shown when follow_up_needed is true) */}
          {watchFollowUpNeeded && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="follow_up_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter follow-up notes" 
                        {...field} 
                        value={field.value || ''}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Follow-up Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={loading}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a follow-up date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : recordId ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UnifiedCareForm;
