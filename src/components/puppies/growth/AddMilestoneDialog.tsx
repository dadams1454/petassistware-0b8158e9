
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePuppyMilestones } from '@/hooks/usePuppyMilestones';
import { useForm } from 'react-hook-form';

interface AddMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puppyId: string;
}

const AddMilestoneDialog: React.FC<AddMilestoneDialogProps> = ({ 
  open, 
  onOpenChange,
  puppyId
}) => {
  const { addMilestone } = usePuppyMilestones(puppyId);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'physical' as 'physical' | 'health' | 'behavioral',
      target_date: new Date().toISOString().split('T')[0]
    }
  });
  
  const onSubmit = (data: any) => {
    addMilestone(data);
    form.reset();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Custom Milestone</DialogTitle>
          <DialogDescription>
            Create a new development milestone to track for this puppy.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., First Bath" {...field} />
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
                      placeholder="Describe what this milestone represents..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="physical">Physical Development</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categorize this milestone for better organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="target_date"
              rules={{ required: 'Target date is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    When do you expect this milestone to be reached?
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
              <Button type="submit">Add Milestone</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMilestoneDialog;
