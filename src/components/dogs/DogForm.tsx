
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { parse } from 'date-fns';

// Import new form components
import TextInput from './form/TextInput';
import SelectInput from './form/SelectInput';
import DatePicker from './form/DatePicker';
import WeightInput from './form/WeightInput';
import CheckboxInput from './form/CheckboxInput';
import TextareaInput from './form/TextareaInput';

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
    birthdateStr: dog?.birthdate ? new Date(dog.birthdate).toLocaleDateString('en-US') : '',
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

      let birthdate = values.birthdate;
      if (!birthdate && values.birthdateStr) {
        try {
          birthdate = parse(values.birthdateStr, 'MM/dd/yyyy', new Date());
        } catch (e) {
          console.error("Date parsing error:", e);
        }
      }

      const dogData = {
        name: values.name,
        breed: values.breed,
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

  // Gender options for the select input
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            form={form} 
            name="name" 
            label="Name" 
            placeholder="Dog name" 
            required={true} 
          />
          
          <TextInput 
            form={form} 
            name="breed" 
            label="Breed" 
            placeholder="Breed" 
            required={true} 
          />
          
          <SelectInput 
            form={form} 
            name="gender" 
            label="Gender" 
            options={genderOptions} 
            placeholder="Select gender" 
          />
          
          <DatePicker 
            form={form} 
            name="birthdate" 
            label="Birthdate" 
          />
          
          <TextInput 
            form={form} 
            name="color" 
            label="Color" 
            placeholder="Color" 
          />
          
          <WeightInput 
            form={form} 
            name="weight" 
            label="Weight (kg)" 
          />
          
          <TextInput 
            form={form} 
            name="microchip_number" 
            label="Microchip Number" 
            placeholder="Microchip number" 
          />
          
          <TextInput 
            form={form} 
            name="registration_number" 
            label="Registration Number" 
            placeholder="Registration number" 
          />
          
          <TextInput 
            form={form} 
            name="photo_url" 
            label="Photo URL" 
            placeholder="Photo URL" 
          />
          
          <CheckboxInput 
            form={form} 
            name="pedigree" 
            label="Has Pedigree" 
          />
        </div>

        <TextareaInput 
          form={form} 
          name="notes" 
          label="Notes" 
          placeholder="Additional notes about the dog" 
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
