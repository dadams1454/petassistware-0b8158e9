
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import CustomerSelector from './CustomerSelector';
import { Customer } from '../customers/types/customer';

interface CreateFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSuccess: () => void;
}

const followUpFormSchema = z.object({
  customer_id: z.string().min(1, 'Please select a customer'),
  followup_type: z.enum(['waitlist', 'customer', 'manual']),
  due_date: z.date(),
  notes: z.string().min(1, 'Please enter follow-up notes'),
});

type FollowUpFormValues = z.infer<typeof followUpFormSchema>;

const CreateFollowUpDialog: React.FC<CreateFollowUpDialogProps> = ({
  open,
  onOpenChange,
  customer,
  onSuccess,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpFormSchema),
    defaultValues: {
      customer_id: customer?.id || '',
      followup_type: 'manual',
      due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      notes: '',
    },
  });

  const handleCustomerSelected = (customer: Customer) => {
    form.setValue('customer_id', customer.id);
    setSelectedCustomer(customer);
  };

  const onSubmit = async (values: FollowUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would save this to a follow_ups table
      console.log('Creating follow-up:', values);
      
      // For this example, we'll just show a success message
      setTimeout(() => {
        toast({
          title: 'Follow-up created',
          description: `Follow-up scheduled for ${selectedCustomer?.first_name} ${selectedCustomer?.last_name} on ${format(values.due_date, 'MMM d, yyyy')}.`,
        });
        
        onSuccess();
        onOpenChange(false);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating follow-up:', error);
      toast({
        title: 'Error',
        description: 'There was a problem creating the follow-up.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Follow-Up</DialogTitle>
          <DialogDescription>
            Schedule a follow-up with a customer
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={() => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <CustomerSelector 
                    onCustomerSelected={handleCustomerSelected}
                    defaultValue={selectedCustomer}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="followup_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-Up Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="waitlist">Waitlist</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                      placeholder="Enter details about this follow-up..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Follow-Up'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFollowUpDialog;
