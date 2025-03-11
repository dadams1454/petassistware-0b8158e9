
import React from 'react';
import { Form } from '@/components/ui/form';
import { useDogForm } from './hooks/useDogForm';
import { DogFormProps } from './schemas/dogFormSchema';
import DogFormSections from './components/DogFormSections';
import DogFormActions from './components/DogFormActions';

const DogForm = ({ dog, onSuccess, onCancel }: DogFormProps) => {
  const {
    form,
    watchBreed,
    colorOptions,
    createDogMutation,
    isEditing,
  } = useDogForm(dog, onSuccess);

  const onSubmit = (values: any) => {
    createDogMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DogFormSections 
          form={form} 
          watchBreed={watchBreed} 
          colorOptions={colorOptions} 
        />
        
        <DogFormActions 
          isEditing={isEditing} 
          isPending={createDogMutation.isPending} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
};

export default DogForm;
