
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePuppyMilestones } from '@/hooks/usePuppyMilestones';

interface AddMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puppyId: string;
}

const milestoneSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  milestone_type: z.string().min(1, "Type is required"),
  expected_age_days: z.coerce.number().min(0, "Age must be a positive number"),
  description: z.string().optional(),
  milestone_category: z.enum(['physical', 'health', 'behavioral']),
});

type MilestoneFormValues = z.infer<typeof milestoneSchema>;

const AddMilestoneDialog: React.FC<AddMilestoneDialogProps> = ({
  open,
  onOpenChange,
  puppyId,
}) => {
  const { addMilestone } = usePuppyMilestones(puppyId);
  
  const defaultValues: MilestoneFormValues = {
    title: '',
    milestone_type: '',
    expected_age_days: 0,
    description: '',
    milestone_category: 'physical',
  };
  
  const form = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneSchema),
    defaultValues,
  });
  
  const handleSubmit = async (values: MilestoneFormValues) => {
    try {
      await addMilestone({
        ...values,
        puppy_id: puppyId,
      });
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Developmental Milestone</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., First Steps" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="milestone_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Motor Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expected_age_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Age (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe this developmental milestone..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="milestone_category"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="physical" />
                        </FormControl>
                        <FormLabel className="font-normal">Physical</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="health" />
                        </FormControl>
                        <FormLabel className="font-normal">Health</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="behavioral" />
                        </FormControl>
                        <FormLabel className="font-normal">Behavioral</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Milestone</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMilestoneDialog;
