
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Customer } from '@/components/customers/types/customer';
import CustomerSelector from './CustomerSelector';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const followUpSchema = z.object({
  customer_id: z.string().min(1, 'Please select a customer'),
  due_date: z.date({
    required_error: 'A follow-up date is required',
  }),
  notes: z.string().min(1, 'Please provide notes for this follow-up'),
});

interface CreateFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSuccess: () => void;
}

const CreateFollowUpDialog: React.FC<CreateFollowUpDialogProps> = ({
  open,
  onOpenChange,
  customer,
  onSuccess,
}) => {
  const form = useForm<z.infer<typeof followUpSchema>>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      customer_id: customer?.id || '',
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof followUpSchema>) => {
    try {
      // Store follow-up data in the database
      // Note: This is a simplified implementation. In a real app, you might want to 
      // create a dedicated table for follow-ups or use a different structure.
      const { data, error } = await supabase
        .from('customer_communications')
        .insert({
          customer_id: values.customer_id,
          type: 'follow-up',
          subject: 'Follow-up Reminder',
          content: values.notes,
          status: 'pending',
          sent_at: values.due_date.toISOString(),
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Follow-up created',
        description: 'The follow-up has been scheduled successfully.',
      });

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error creating follow-up',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCustomerSelected = (selectedCustomer: Customer) => {
    form.setValue('customer_id', selectedCustomer.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Follow-Up</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Customer</FormLabel>
                  <CustomerSelector 
                    onCustomerSelected={handleCustomerSelected}
                    defaultValue={customer}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Follow-up Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date when this follow-up should be completed.
                  </FormDescription>
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
                      placeholder="Enter important details about this follow-up..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any relevant details for this follow-up.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Follow-Up</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFollowUpDialog;
