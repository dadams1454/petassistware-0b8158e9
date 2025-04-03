
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { SocializationCategory, SocializationReactionType } from '@/types/puppyTracking';
import { REACTION_EMOJI_MAP } from '@/utils/socializationHelpers';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SOCIALIZATION_CATEGORIES } from '@/data/socializationCategories';

interface SocializationExperienceFormProps {
  puppyId: string;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const REACTION_TYPES: Array<{id: SocializationReactionType, name: string, emoji: string, color: string}> = [
  { id: 'very_positive', name: 'Very Positive', emoji: REACTION_EMOJI_MAP['very_positive'] || '😄', color: 'text-green-600' },
  { id: 'positive', name: 'Positive', emoji: REACTION_EMOJI_MAP['positive'] || '🙂', color: 'text-green-500' },
  { id: 'neutral', name: 'Neutral', emoji: REACTION_EMOJI_MAP['neutral'] || '😐', color: 'text-gray-500' },
  { id: 'cautious', name: 'Cautious', emoji: REACTION_EMOJI_MAP['cautious'] || '😟', color: 'text-yellow-500' },
  { id: 'fearful', name: 'Fearful', emoji: REACTION_EMOJI_MAP['fearful'] || '😨', color: 'text-orange-500' },
  { id: 'very_fearful', name: 'Very Fearful', emoji: REACTION_EMOJI_MAP['very_fearful'] || '😱', color: 'text-red-500' },
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
    category: {
      id: SOCIALIZATION_CATEGORIES[0].id,
      name: SOCIALIZATION_CATEGORIES[0].name
    },
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
                      field.onChange({
                        id: category.id,
                        name: category.name
                      });
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
