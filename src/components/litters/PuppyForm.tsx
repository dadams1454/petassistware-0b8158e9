
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import { supabase } from '@/integrations/supabase/client';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import DatePicker from '@/components/dogs/form/DatePicker';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { toast } from '@/components/ui/use-toast';

interface PuppyFormData {
  name: string | null;
  gender: string | null;
  status: string;
  microchip_number: string | null;
  sale_price: number | null;
  birth_weight: number | null;
  current_weight: number | null;
  color: string | null;
  markings: string | null;
  notes: string | null;
  photo_url: string | null;
  reservation_date: Date | null;
}

interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy;
  onSuccess: () => void;
  onCancel?: () => void;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'Sold', label: 'Sold' },
  { value: 'Retained', label: 'Retained' },
  { value: 'Deceased', label: 'Deceased' },
];

const PuppyForm: React.FC<PuppyFormProps> = ({ 
  litterId, 
  initialData, 
  onSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PuppyFormData>({
    defaultValues: {
      name: initialData?.name || null,
      gender: initialData?.gender || null,
      status: initialData?.status || 'Available',
      microchip_number: initialData?.microchip_number || null,
      sale_price: initialData?.sale_price || null,
      birth_weight: initialData?.birth_weight || null,
      current_weight: initialData?.current_weight || null,
      color: initialData?.color || null,
      markings: initialData?.markings || null,
      notes: initialData?.notes || null,
      photo_url: initialData?.photo_url || null,
      reservation_date: initialData?.reservation_date ? new Date(initialData.reservation_date) : null,
    }
  });

  const handleSubmit = async (data: PuppyFormData) => {
    setIsSubmitting(true);
    try {
      // Process dates
      const processedData = {
        ...data,
        litter_id: litterId,
        reservation_date: data.reservation_date ? data.reservation_date.toISOString().split('T')[0] : null
      };

      console.log('Submitting puppy data:', processedData);

      if (initialData) {
        // Update existing puppy
        const { error } = await supabase
          .from('puppies')
          .update(processedData)
          .eq('id', initialData.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Puppy updated successfully",
        });
      } else {
        // Create new puppy
        const { error } = await supabase
          .from('puppies')
          .insert(processedData);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Puppy added successfully",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving puppy:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the puppy",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            form={form} 
            name="name" 
            label="Name" 
            placeholder="Puppy name (optional)" 
          />
          
          <SelectInput 
            form={form} 
            name="gender" 
            label="Gender" 
            options={genderOptions} 
            placeholder="Select gender" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput 
            form={form} 
            name="status" 
            label="Status" 
            options={statusOptions} 
          />
          
          <TextInput 
            form={form} 
            name="microchip_number" 
            label="Microchip Number" 
            placeholder="Enter microchip number" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            form={form} 
            name="birth_weight" 
            label="Birth Weight (oz)" 
            placeholder="Weight at birth" 
          />
          
          <TextInput 
            form={form} 
            name="current_weight" 
            label="Current Weight (lbs)" 
            placeholder="Current weight" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            form={form} 
            name="color" 
            label="Color" 
            placeholder="Coat color" 
          />
          
          <TextInput 
            form={form} 
            name="markings" 
            label="Markings" 
            placeholder="Distinctive markings" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            form={form} 
            name="sale_price" 
            label="Sale Price" 
            placeholder="Enter sale price" 
          />
          
          <DatePicker 
            form={form} 
            name="reservation_date" 
            label="Reservation Date" 
          />
        </div>

        <PhotoUpload 
          form={form} 
          name="photo_url" 
          label="Puppy Photo" 
        />

        <TextareaInput 
          form={form} 
          name="notes" 
          label="Notes" 
          placeholder="Additional notes about this puppy" 
        />

        <div className="flex justify-end space-x-2 pt-4">
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
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth={false}
          >
            {initialData ? 'Update Puppy' : 'Add Puppy'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default PuppyForm;
