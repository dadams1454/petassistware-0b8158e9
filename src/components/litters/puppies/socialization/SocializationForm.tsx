
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SocializationCategory } from '../types';
import { socializationCategoryOptions } from './socializationCategories';
import { socializationReactions } from './socializationReactions';

// Form schema
const formSchema = z.object({
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  experience: z.string().min(2, 'Experience is required'),
  experience_date: z.date({
    required_error: 'Please select a date',
  }),
  reaction: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SocializationFormProps {
  onSubmit: (experience: {
    category: SocializationCategory;
    experience: string;
    experience_date: string;
    reaction?: string;
    notes?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const SocializationForm: React.FC<SocializationFormProps> = ({ onSubmit, isSubmitting }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: '',
      experience_date: new Date(),
      notes: '',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      ...values,
      experience_date: values.experience_date.toISOString().split('T')[0],
    });
    form.reset();
  };

  // Function to get example experiences for the selected category
  const getCategoryExamples = (categoryId: string) => {
    const category = socializationCategoryOptions.find(cat => cat.id === categoryId);
    return category ? category.examples : [];
  };

  // When category changes, reset the experience field
  const onCategoryChange = (categoryId: string) => {
    const category = socializationCategoryOptions.find(cat => cat.id === categoryId);
    if (category) {
      form.setValue('category', { id: category.id, name: category.name });
    }
    form.setValue('experience', '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={(value) => onCategoryChange(value)} 
                value={field.value?.id}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {socializationCategoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of socialization experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Describe the experience" />
              </FormControl>
              <FormDescription>
                {form.watch('category')?.id && (
                  <div>
                    <p className="mb-1">Examples:</p>
                    <ul className="list-disc pl-5 text-sm">
                      {getCategoryExamples(form.watch('category')?.id).map((example, index) => (
                        <li key={index} className="mb-1">
                          <Button 
                            type="button" 
                            variant="link" 
                            className="p-0 h-auto text-sm"
                            onClick={() => form.setValue('experience', example)}
                          >
                            {example}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="experience_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
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
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reaction */}
        <FormField
          control={form.control}
          name="reaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reaction</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How did the puppy react?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {socializationReactions.map((reaction) => (
                    <SelectItem key={reaction.id} value={reaction.id}>
                      {reaction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Record how the puppy responded to the experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional observations or details"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional details about this socialization experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Record Experience'}
        </Button>
      </form>
    </Form>
  );
};

export default SocializationForm;
