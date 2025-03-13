
import React from 'react';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { LitterFormData } from '../hooks/useLitterForm';
import BasicInfoTab from './tabs/BasicInfoTab';
import AKCRegistrationTab from './tabs/AKCRegistrationTab';
import BreedingDetailsTab from './tabs/BreedingDetailsTab';
import LitterFormActions from './tabs/LitterFormActions';

interface LitterFormLayoutProps {
  form: UseFormReturn<LitterFormData>;
  isSubmitting: boolean;
  onSubmit: (data: LitterFormData) => void;
  onCancel?: () => void;
  isEditMode: boolean;
}

const LitterFormLayout: React.FC<LitterFormLayoutProps> = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditMode
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="akc">AKC Registration</TabsTrigger>
            <TabsTrigger value="breeding">Breeding Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfoTab form={form} />
          </TabsContent>
          
          <TabsContent value="akc">
            <AKCRegistrationTab form={form} />
          </TabsContent>
          
          <TabsContent value="breeding">
            <BreedingDetailsTab form={form} />
          </TabsContent>
        </Tabs>

        <LitterFormActions 
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          isEditMode={isEditMode}
        />
      </form>
    </Form>
  );
};

export default LitterFormLayout;
