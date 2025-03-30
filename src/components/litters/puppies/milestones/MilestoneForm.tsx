
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { milestoneOptions } from './milestoneData';
import { MilestoneType } from './types';

const milestoneFormSchema = z.object({
  milestone_type: z.string() as z.ZodType<MilestoneType>,
  milestone_date: z.date(),
  notes: z.string().optional()
});

type MilestoneFormValues = z.infer<typeof milestoneFormSchema>;

interface MilestoneFormProps {
  onSubmit: (data: MilestoneFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  birthDate?: Date | string | null;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting,
  birthDate
}) => {
  const birthDateObj = birthDate ? (typeof birthDate === 'string' ? new Date(birthDate) : birthDate) : null;
  
  const form = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      milestone_type: 'eyes_open',
      milestone_date: new Date(),
      notes: ''
    }
  });

  const selectedMilestoneType = form.watch('milestone_type');
  const selectedMilestone = milestoneOptions.find(m => m.value === selectedMilestoneType);
  
  return (
    <Card className="border-dashed border-primary/50 bg-primary/5">
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Record New Milestone</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="milestone_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select milestone type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {milestoneOptions.map((milestone) => (
                        <SelectItem key={milestone.value} value={milestone.value}>
                          {milestone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMilestone && selectedMilestone.value !== 'custom' && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <p className="font-medium mb-1">{selectedMilestone.label}</p>
                <p>{selectedMilestone.description}</p>
                {birthDateObj && (
                  <div className="mt-2 flex flex-col space-y-1">
                    <p className="text-xs font-medium">Typical age range:</p>
                    <div className="flex space-x-2 text-xs">
                      <span>
                        Earliest: Day {selectedMilestone.typicalAgeRange.earliestDay} 
                        ({format(new Date(birthDateObj.getTime() + selectedMilestone.typicalAgeRange.earliestDay * 24 * 60 * 60 * 1000), 'MMM d')})
                      </span>
                      <span>•</span>
                      <span>
                        Latest: Day {selectedMilestone.typicalAgeRange.latestDay}
                        ({format(new Date(birthDateObj.getTime() + selectedMilestone.typicalAgeRange.latestDay * 24 * 60 * 60 * 1000), 'MMM d')})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="milestone_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Observed</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
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
                        disabled={(date) => {
                          // Cannot be in the future
                          if (date > new Date()) return true;
                          // Cannot be before birth date
                          if (birthDateObj && date < birthDateObj) return true;
                          return false;
                        }}
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
                      placeholder="Add any notes about this milestone"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Milestone"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MilestoneForm;
