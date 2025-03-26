
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createFeedingSchedule } from '@/services/dailyCare/feedingService';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  dog_id: z.string().min(1, { message: 'Please select a dog' }),
  food_type: z.string().min(1, { message: 'Please enter food type' }),
  amount: z.string().min(1, { message: 'Please enter amount' }),
  unit: z.enum(['cups', 'grams', 'oz', 'lbs', 'kg']),
  schedule_time: z.array(z.string()).min(1, { message: 'Please add at least one feeding time' }),
  special_instructions: z.string().optional(),
  active: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

interface FeedingScheduleFormProps {
  dogId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FeedingScheduleForm: React.FC<FeedingScheduleFormProps> = ({ dogId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [newTime, setNewTime] = React.useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dog_id: dogId,
      food_type: '',
      amount: '',
      unit: 'cups',
      schedule_time: [],
      special_instructions: '',
      active: true
    }
  });
  
  const scheduleTime = form.watch('schedule_time');
  
  const handleAddTime = () => {
    if (!newTime) return;
    
    // Check if time is already in the list
    if (scheduleTime.includes(newTime)) {
      toast({
        title: 'Time already added',
        description: 'This feeding time is already in the schedule.',
        variant: 'destructive'
      });
      return;
    }
    
    form.setValue('schedule_time', [...scheduleTime, newTime]);
    setNewTime('');
  };
  
  const handleRemoveTime = (time: string) => {
    form.setValue('schedule_time', scheduleTime.filter(t => t !== time));
  };
  
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await createFeedingSchedule(values);
      toast({
        title: 'Schedule created',
        description: 'Feeding schedule has been created successfully.'
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to create feeding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create feeding schedule.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Feeding Schedule</CardTitle>
        <CardDescription>Set up a regular feeding schedule for this dog</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="food_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Type</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Dry kibble, Wet food, Raw diet" {...field} />
                  </FormControl>
                  <FormDescription>
                    Specify the type of food for this schedule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cups">Cups</SelectItem>
                        <SelectItem value="grams">Grams</SelectItem>
                        <SelectItem value="oz">Ounces</SelectItem>
                        <SelectItem value="lbs">Pounds</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <FormLabel>Feeding Times</FormLabel>
              <div className="flex space-x-2">
                <Input 
                  placeholder="e.g., 8:00 AM" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTime} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <FormField
                control={form.control}
                name="schedule_time"
                render={() => (
                  <FormItem>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {scheduleTime.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No feeding times added</p>
                      ) : (
                        scheduleTime.map((time) => (
                          <Badge key={time} variant="secondary" className="flex items-center gap-1">
                            {time}
                            <button
                              type="button"
                              onClick={() => handleRemoveTime(time)}
                              className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground ml-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="special_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., Mix with warm water, Add medication, etc." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Any special instructions for this feeding schedule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedingScheduleForm;
