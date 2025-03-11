
import React, { useEffect, useState } from 'react';
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
import PhotoUpload from './form/PhotoUpload';

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
  const [colorOptions, setColorOptions] = useState<{value: string, label: string}[]>([]);

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

  // Watch for breed changes
  const watchBreed = form.watch('breed');

  // Update color options when breed changes
  useEffect(() => {
    if (watchBreed === 'Newfoundland') {
      setColorOptions([
        { value: 'Black 007', label: 'Black 007' },
        { value: 'Brown 061', label: 'Brown 061' },
        { value: 'Gray 100', label: 'Gray 100' },
        { value: 'brown/white 063', label: 'brown/white 063' },
        { value: 'black/white 202', label: 'black/white 202' },
      ]);

      // Reset color if current selection is not in the Newfoundland colors
      const currentColor = form.getValues('color');
      if (currentColor && !['Black 007', 'Brown 061', 'Gray 100', 'brown/white 063', 'black/white 202'].includes(currentColor)) {
        form.setValue('color', '');
      }
    } else {
      setColorOptions([]);
    }
  }, [watchBreed, form]);

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

  // Standard breed options
  const breedOptions = [
    { value: 'Newfoundland', label: 'Newfoundland' },
    { value: 'Labrador Retriever', label: 'Labrador Retriever' },
    { value: 'Golden Retriever', label: 'Golden Retriever' },
    { value: 'German Shepherd', label: 'German Shepherd' },
    { value: 'Mixed Breed', label: 'Mixed Breed' },
    { value: 'Other', label: 'Other' }
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
          
          <SelectInput 
            form={form} 
            name="breed" 
            label="Breed" 
            options={breedOptions} 
            placeholder="Select breed" 
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
          
          {watchBreed === 'Newfoundland' ? (
            <SelectInput 
              form={form} 
              name="color" 
              label="Color" 
              options={colorOptions} 
              placeholder="Select color" 
            />
          ) : (
            <TextInput 
              form={form} 
              name="color" 
              label="Color" 
              placeholder="Color" 
            />
          )}
          
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
          
          <div className="md:col-span-2">
            <PhotoUpload
              form={form}
              name="photo_url"
              label="Dog Photo"
            />
          </div>
          
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
