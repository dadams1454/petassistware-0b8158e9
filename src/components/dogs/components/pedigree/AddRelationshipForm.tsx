
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DogSelector from '@/components/litters/form/DogSelector';
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

const relationshipSchema = z.object({
  relatedDogId: z.string().min(1, "Please select a dog"),
  type: z.enum(['parent', 'offspring'])
});

interface AddRelationshipFormProps {
  dogName: string;
  onSubmit: (values: z.infer<typeof relationshipSchema>) => Promise<void>;
  onCancel: () => void;
}

const AddRelationshipForm = ({ dogName, onSubmit, onCancel }: AddRelationshipFormProps) => {
  const form = useForm<z.infer<typeof relationshipSchema>>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      relatedDogId: '',
      type: 'parent'
    }
  });

  const handleSubmit = async (values: z.infer<typeof relationshipSchema>) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="parent">Parent of {dogName}</SelectItem>
                  <SelectItem value="offspring">Child of {dogName}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relatedDogId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Dog</FormLabel>
              <DogSelector
                form={form}
                name="relatedDogId"
                label="Select Dog"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddRelationshipForm;
