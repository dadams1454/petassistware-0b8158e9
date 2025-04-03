
import React from 'react';
import { Form } from '@/components/ui/form';
import { CustomButton } from '@/components/ui/custom-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './puppies/BasicInfoTab';
import WeightsTab from './puppies/WeightsTab';
import HealthTab from './puppies/HealthTab';
import AKCRegistrationTab from './puppies/AKCRegistrationTab';
import NewOwnerTab from './puppies/NewOwnerTab';
import { PuppyFormProps } from './puppies/types';
import { usePuppyForm, PuppyFormValues } from '@/hooks/usePuppyForm';

const PuppyForm: React.FC<PuppyFormProps> = ({ 
  litterId, 
  initialData, 
  onSuccess,
  onCancel 
}) => {
  const { form, isSubmitting, handleSubmit } = usePuppyForm({
    litterId,
    initialData,
    onSuccess: onSuccess || (() => {})
  });

  // Create a wrapper function to handle the form submission
  const onSubmit = (values: PuppyFormValues) => {
    return handleSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="weights">Weight</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="akc">AKC Registr.</TabsTrigger>
            <TabsTrigger value="owner">New Owner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <BasicInfoTab form={form} litterId={litterId} />
          </TabsContent>
          
          <TabsContent value="weights" className="space-y-4">
            <WeightsTab form={form} />
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            <HealthTab form={form} />
          </TabsContent>

          <TabsContent value="akc" className="space-y-4">
            <AKCRegistrationTab form={form} />
          </TabsContent>

          <TabsContent value="owner" className="space-y-4">
            <NewOwnerTab form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <CustomButton
              type="button"
              variant="secondary"
              onClick={onCancel}
              fullWidth={false}
            >
              Cancel
            </CustomButton>
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
