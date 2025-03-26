import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { recordFeeding } from '@/services/dailyCare/feedingService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  dog_id: z.string().min(1, { message: 'Dog ID is required' }),
  schedule_id: z.string().optional(),
  food_type: z.string().min(1, { message: 'Please enter food type' }),
  amount_offered: z.string().min(1, { message: 'Please enter amount offered' }),
  amount_consumed: z.string().optional(),
  notes: z.string().optional(),
  timestamp: z.string().min(1, { message: 'Timestamp is required' })
});

type FormValues = z.infer<typeof formSchema>;

interface FeedingRecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  dogName: string;
  scheduleId?: string;
  defaultFoodType?: string;
  defaultAmount?: string;
  onSuccess?: () => void;
}

const FeedingRecordForm: React.FC<FeedingRecordFormProps> = ({
  open,
  onOpenChange,
  dogId,
  dogName,
  scheduleId,
  defaultFoodType = '',
  defaultAmount = '',
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dog_id: dogId,
      schedule_id: scheduleId,
      food_type: defaultFoodType,
      amount_offered: defaultAmount,
      amount_consumed: '',
      notes: '',
      timestamp: new Date().toISOString()
    }
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!user?.id) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to record a feeding.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Make sure dog_id is included and not optional
      const recordData = {
        ...values,
        dog_id: dogId, // Explicitly set the dog_id from props
        staff_id: user.id
      };
      
      await recordFeeding(recordData);
      
      toast({
        title: 'Feeding recorded',
        description: `Successfully recorded feeding for ${dogName}.`
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error recording feeding:', error);
      toast({
        title: 'Error',
        description: 'Failed to record feeding.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Feeding for {dogName}</DialogTitle>
          <DialogDescription>
            Enter the details about this feeding event
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="food_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Type</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Dry kibble, Wet food" {...field} />
                  </FormControl>
                  <FormDescription>
                    Type of food provided
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount_offered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Offered</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 cups" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount_consumed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Consumed (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1.5 cups" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any observations or notes about this feeding" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timestamp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timestamp</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date.toISOString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedingRecordForm;
