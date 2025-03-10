
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { CustomButton } from '@/components/ui/custom-button';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './puppies/BasicInfoTab';
import WeightsTab from './puppies/WeightsTab';
import HealthTab from './puppies/HealthTab';
import { PuppyFormData, PuppyFormProps } from './puppies/types';

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
            <BasicInfoTab form={form} />
          </TabsContent>
          
          <TabsContent value="weights" className="space-y-4">
            <WeightsTab form={form} />
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            <HealthTab form={form} />
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
