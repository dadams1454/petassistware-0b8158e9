
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import { supabase } from '@/integrations/supabase/client';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DatePicker from '@/components/dogs/form/DatePicker';
import WeightInput from '@/components/dogs/form/WeightInput';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';

interface PuppyFormData {
  name: string | null;
  gender: string | null;
  status: string;
  color: string | null;
  birth_date: Date | null;
  birth_weight: string | null;
  current_weight: string | null;
  microchip_number: string | null;
  sale_price: number | null;
  deworming_dates: string | null;
  vaccination_dates: string | null;
  vet_check_dates: string | null;
  notes: string | null;
  photo_url: string | null;
}

interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy;
  onSuccess: () => void;
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
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PuppyFormData>({
    defaultValues: {
      name: initialData?.name || null,
      gender: initialData?.gender || null,
      status: initialData?.status || 'Available',
      color: initialData?.color || null,
      birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : null,
      birth_weight: initialData?.birth_weight || null,
      current_weight: initialData?.current_weight || null,
      microchip_number: initialData?.microchip_number || null,
      sale_price: initialData?.sale_price || null,
      deworming_dates: initialData?.deworming_dates || null,
      vaccination_dates: initialData?.vaccination_dates || null,
      vet_check_dates: initialData?.vet_check_dates || null,
      notes: initialData?.notes || null,
      photo_url: initialData?.photo_url || null,
    }
  });

  const handleSubmit = async (data: PuppyFormData) => {
    setIsSubmitting(true);
    try {
      const puppyData = {
        ...data,
        litter_id: litterId,
        birth_date: data.birth_date ? data.birth_date.toISOString().split('T')[0] : null,
      };

      if (initialData) {
        // Update existing puppy
        const { error } = await supabase
          .from('puppies')
          .update(puppyData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new puppy
        const { error } = await supabase
          .from('puppies')
          .insert(puppyData);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving puppy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="weights">Weight Tracking</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
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
                label="Sex" 
                options={genderOptions} 
                placeholder="Select gender" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                form={form}
                name="birth_date"
                label="Birth Date"
              />
              
              <TextInput 
                form={form} 
                name="color" 
                label="Color" 
                placeholder="Puppy's color markings" 
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

            <TextInput 
              form={form} 
              name="sale_price" 
              label="Sale Price" 
              placeholder="Enter sale price" 
            />

            <PhotoUpload
              form={form}
              name="photo_url"
              label="Puppy Photo"
            />
          </TabsContent>
          
          <TabsContent value="weights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WeightInput 
                form={form} 
                name="birth_weight" 
                label="Birth Weight (oz)" 
              />
              
              <WeightInput 
                form={form} 
                name="current_weight" 
                label="Current Weight (oz)" 
              />
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground mb-2">
                Note: This simplified form shows birth weight and current weight. For more detailed 
                weight tracking over time, we'll be adding a dedicated weight history feature in a future update.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            <TextareaInput
              form={form}
              name="deworming_dates"
              label="Deworming Dates"
              placeholder="Enter deworming dates and details (e.g., June 1 - Panacur, June 14 - Drontal)"
            />
            
            <TextareaInput
              form={form}
              name="vaccination_dates"
              label="Vaccination Dates"
              placeholder="Enter vaccination dates and details (e.g., June 28 - DHPP, July 12 - DHPP Booster)"
            />
            
            <TextareaInput
              form={form}
              name="vet_check_dates"
              label="Vet Check Dates"
              placeholder="Enter vet check dates and findings"
            />
            
            <TextareaInput
              form={form}
              name="notes"
              label="Additional Notes"
              placeholder="Any other health information or general notes about the puppy"
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
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
