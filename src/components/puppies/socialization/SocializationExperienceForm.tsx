
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
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
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocializationReactionObject } from '@/types/puppyTracking';

interface SocializationExperienceFormProps {
  puppyId: string;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const SOCIALIZATION_CATEGORIES = [
  { id: 'people', name: 'People' },
  { id: 'animals', name: 'Animals' },
  { id: 'environments', name: 'Environments' },
  { id: 'sounds', name: 'Sounds' },
  { id: 'handling', name: 'Handling' },
  { id: 'surfaces', name: 'Surfaces' },
  { id: 'objects', name: 'Objects' },
];

const REACTION_TYPES: SocializationReactionObject[] = [
  { id: 'very_positive', name: 'Very Positive', emoji: '😄', color: 'text-green-600' },
  { id: 'positive', name: 'Positive', emoji: '🙂', color: 'text-green-500' },
  { id: 'neutral', name: 'Neutral', emoji: '😐', color: 'text-gray-500' },
  { id: 'cautious', name: 'Cautious', emoji: '😟', color: 'text-yellow-500' },
  { id: 'fearful', name: 'Fearful', emoji: '😨', color: 'text-orange-500' },
  { id: 'very_fearful', name: 'Very Fearful', emoji: '😱', color: 'text-red-500' },
];

const experienceSchema = z.object({
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  experience: z.string().min(3, "Experience description is required"),
  experience_date: z.date({
    required_error: "Date is required",
  }),
  reaction: z.string().optional(),
  notes: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

const SocializationExperienceForm: React.FC<SocializationExperienceFormProps> = ({ 
  puppyId,
  onSubmit,
  onCancel 
}) => {
  const defaultValues: ExperienceFormValues = {
    category: SOCIALIZATION_CATEGORIES[0],
    experience: '',
    experience_date: new Date(),
    reaction: 'neutral',
    notes: '',
  };
  
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });
  
  const handleSubmit = (values: ExperienceFormValues) => {
    // Format the date to ISO string for the API
    const formattedValues = {
      ...values,
      experience_date: format(values.experience_date, 'yyyy-MM-dd'),
    };
    
    onSubmit(formattedValues);
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const category = SOCIALIZATION_CATEGORIES.find(cat => cat.id === value);
                    if (category) {
                      field.onChange(category);
                    }
                  }}
                  defaultValue={field.value.id}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SOCIALIZATION_CATEGORIES.map((category) => (
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
        </div>
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Description</FormLabel>
              <FormControl>
                <Input placeholder="Describe the socialization experience" {...field} />
              </FormControl>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reaction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REACTION_TYPES.map((reaction) => (
                    <SelectItem key={reaction.id} value={reaction.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{reaction.emoji}</span>
                        <span className={reaction.color}>{reaction.name}</span>
                      </div>
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
                  placeholder="Additional observations or notes"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save Experience</Button>
        </div>
      </form>
    </Form>
  );
};

export default SocializationExperienceForm;
