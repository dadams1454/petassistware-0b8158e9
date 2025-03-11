
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { dogFormSchema, DogFormValues } from '../schemas/dogFormSchema';
import { parse } from 'date-fns';

export const useDogForm = (dog: any, onSuccess: () => void) => {
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

  return {
    form,
    watchBreed,
    colorOptions,
    createDogMutation,
    isEditing,
  };
};
