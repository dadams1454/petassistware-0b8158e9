
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SOCIALIZATION_CATEGORIES, SOCIALIZATION_REACTIONS } from '@/data/socializationCategories';

const formSchema = z.object({
  category_id: z.string({
    required_error: "Please select a category"
  }),
  experience: z.string().min(3, {
    message: "Experience description must be at least 3 characters"
  }),
  experience_date: z.date({
    required_error: "Please select a date"
  }),
  reaction: z.string().optional(),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface SocializationFormProps {
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

const SocializationForm: React.FC<SocializationFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  onCancel
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: '',
      experience: '',
      experience_date: new Date(),
      reaction: '',
      notes: ''
    }
  });
  
  const selectedCategory = form.watch('category_id');
  const category = SOCIALIZATION_CATEGORIES.find(c => c.id === selectedCategory);
  
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category*</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SOCIALIZATION_CATEGORIES.map(category => (
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
        
        {category && (
          <div className="text-sm p-3 bg-muted/50 rounded-md">
            <p className="font-medium">{category.name}</p>
            <p className="text-muted-foreground">{category.description}</p>
            {category.examples && category.examples.length > 0 && (
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  Examples: {category.examples.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience*</FormLabel>
              <FormControl>
                <Input placeholder="What did the puppy experience?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experience_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date*</FormLabel>
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
                    disabled={(date) => date > new Date()}
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
          name="reaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Puppy's Reaction</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How did the puppy react?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SOCIALIZATION_REACTIONS.map(reaction => (
                    <SelectItem key={reaction.id} value={reaction.id}>
                      {reaction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  placeholder="Additional observations or details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Experience"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SocializationForm;
