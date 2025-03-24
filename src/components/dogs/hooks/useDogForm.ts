
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthProvider';
import { dogFormSchema, DogFormValues } from '../schemas/dogFormSchema';
import { parseLitterNumber } from '../utils/dogFormUtils';
import { useBreedColors } from './useBreedColors';
import { useDogMutation } from './useDogMutation';

export const useDogForm = (dog: any, onSuccess: () => void) => {
  const { user } = useAuth();
  
  // Initialize default form values from dog data or empty values
  const defaultValues: DogFormValues = {
    name: dog?.name || '',
    breed: dog?.breed || '',
    birthdate: dog?.birthdate ? new Date(dog.birthdate) : null,
    birthdateStr: dog?.birthdate ? new Date(dog.birthdate).toLocaleDateString('en-US') : '',
    gender: dog?.gender || '',
    color: dog?.color || '',
    weight: dog?.weight?.toString() || '',
    weight_unit: dog?.weight_unit || 'lbs',
    microchip_number: dog?.microchip_number || '',
    microchip_location: dog?.microchip_location || '',
    registration_number: dog?.registration_number || '',
    registration_organization: dog?.registration_organization || '',
    status: dog?.status || 'active',
    pedigree: dog?.pedigree || false,
    notes: dog?.notes || '',
    photo_url: dog?.photo_url || '',
    requires_special_handling: dog?.requires_special_handling || false,
    potty_alert_threshold: dog?.potty_alert_threshold || 300,
    max_time_between_breaks: dog?.max_time_between_breaks || 360,
    // Female dog breeding fields
    is_pregnant: dog?.is_pregnant || false,
    last_heat_date: dog?.last_heat_date ? new Date(dog.last_heat_date) : null,
    tie_date: dog?.tie_date ? new Date(dog.tie_date) : null,
    litter_number: parseLitterNumber(dog?.litter_number),
    // Vaccination fields
    last_vaccination_date: dog?.last_vaccination_date ? new Date(dog.last_vaccination_date) : null,
    vaccination_type: dog?.vaccination_type || '',
    vaccination_notes: dog?.vaccination_notes || '',
  };

  // Initialize form with validation
  const form = useForm<DogFormValues>({
    resolver: zodResolver(dogFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Watch for breed changes
  const watchBreed = form.watch('breed');
  
  // Get breed-specific color options
  const { colorOptions } = useBreedColors(form, watchBreed);
  
  // Get dog mutation functions
  const { createDogMutation, isEditing } = useDogMutation(dog, user?.id, onSuccess);

  return {
    form,
    watchBreed,
    colorOptions,
    createDogMutation,
    isEditing,
  };
};
