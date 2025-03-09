
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, MinusCircle, PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const dogFormSchema = z.object({
  name: z.string().min(1, { message: 'Dog name is required' }),
  breed: z.string().min(1, { message: 'Breed is required' }),
  birthdate: z.date().optional().nullable(),
  birthdateStr: z.string().optional(),
  gender: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional().transform(val => val ? parseFloat(val) : null),
  microchip_number: z.string().optional(),
  registration_number: z.string().optional(),
  pedigree: z.boolean().default(false),
  notes: z.string().optional(),
  photo_url: z.string().optional(),
});

type DogFormValues = z.infer<typeof dogFormSchema>;

interface DogFormProps {
  dog?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const DogForm = ({ dog, onSuccess, onCancel }: DogFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!dog;

  const defaultValues: DogFormValues = {
    name: dog?.name || '',
    breed: dog?.breed || '',
    birthdate: dog?.birthdate ? new Date(dog.birthdate) : null,
    birthdateStr: dog?.birthdate ? format(new Date(dog.birthdate), 'MM/dd/yyyy') : '',
    gender: dog?.gender || '',
    color: dog?.color || '',
    weight: dog?.weight?.toString() || '',
    microchip_number: dog?.microchip_number || '',
    registration_number: dog?.registration_number || '',
    pedigree: dog?.pedigree || false,
    notes: dog?.notes || '',
    photo_url: dog?.photo_url || '',
  };

  const form = useForm<DogFormValues>({
    resolver: zodResolver(dogFormSchema),
    defaultValues,
  });

  const createDogMutation = useMutation({
    mutationFn: async (values: DogFormValues) => {
      if (!user) throw new Error('You must be logged in');

      // Convert date string to Date object if provided
      let birthdate = values.birthdate;
      if (!birthdate && values.birthdateStr) {
        try {
          birthdate = parse(values.birthdateStr, 'MM/dd/yyyy', new Date());
        } catch (e) {
          console.error("Date parsing error:", e);
        }
      }

      // Ensure required fields are present for Supabase
      const dogData = {
        name: values.name,          // Required field
        breed: values.breed,        // Required field
        birthdate: birthdate ? birthdate.toISOString().split('T')[0] : null,
        gender: values.gender,
        color: values.color,
        weight: values.weight,
        microchip_number: values.microchip_number,
        registration_number: values.registration_number,
        pedigree: values.pedigree,
        notes: values.notes,
        photo_url: values.photo_url,
        owner_id: user.id,
      };

      const { data, error } = isEditing
        ? await supabase
            .from('dogs')
            .update(dogData)
            .eq('id', dog.id)
            .select()
        : await supabase
            .from('dogs')
            .insert(dogData)
            .select();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast({
        title: isEditing ? 'Dog updated' : 'Dog added',
        description: isEditing
          ? 'Dog has been successfully updated'
          : 'New dog has been successfully added',
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: isEditing ? 'Error updating dog' : 'Error adding dog',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: DogFormValues) => {
    createDogMutation.mutate(values);
  };

  // Function to increment weight
  const incrementWeight = () => {
    const currentWeight = form.getValues("weight");
    const newWeight = currentWeight ? parseFloat(currentWeight) + 0.1 : 0.1;
    form.setValue("weight", newWeight.toFixed(1).toString());
  };

  // Function to decrement weight
  const decrementWeight = () => {
    const currentWeight = form.getValues("weight");
    if (!currentWeight) return;
    
    const newWeight = Math.max(0, parseFloat(currentWeight) - 0.1);
    form.setValue("weight", newWeight.toFixed(1).toString());
  };

  // Update date when calendar changes
  const handleCalendarSelect = (date: Date | undefined) => {
    form.setValue("birthdate", date || null);
    if (date) {
      form.setValue("birthdateStr", format(date, 'MM/dd/yyyy'));
    }
  };

  // Update calendar when date string changes
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    form.setValue("birthdateStr", dateStr);
    
    try {
      if (dateStr) {
        const parsedDate = parse(dateStr, 'MM/dd/yyyy', new Date());
        if (!isNaN(parsedDate.getTime())) {
          form.setValue("birthdate", parsedDate);
        }
      } else {
        form.setValue("birthdate", null);
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Dog name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed*</FormLabel>
                <FormControl>
                  <Input placeholder="Breed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Birthdate</FormLabel>
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="birthdateStr"
                    render={({ field: dateStrField }) => (
                      <FormControl>
                        <Input 
                          placeholder="MM/DD/YYYY" 
                          value={dateStrField.value || ''}
                          onChange={handleDateInputChange}
                        />
                      </FormControl>
                    )}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="px-2"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={handleCalendarSelect}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="Color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="rounded-r-none" 
                    onClick={decrementWeight}
                  >
                    <MinusCircle size={16} />
                  </Button>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Weight"
                      {...field}
                      className="rounded-none text-center"
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="rounded-l-none" 
                    onClick={incrementWeight}
                  >
                    <PlusCircle size={16} />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="microchip_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Microchip Number</FormLabel>
                <FormControl>
                  <Input placeholder="Microchip number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registration_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="Registration number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo URL</FormLabel>
                <FormControl>
                  <Input placeholder="Photo URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pedigree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Has Pedigree</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about the dog"
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createDogMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createDogMutation.isPending}>
            {createDogMutation.isPending ? (
              <span className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                {isEditing ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              <span>{isEditing ? 'Update Dog' : 'Add Dog'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DogForm;
