
import React from 'react';
import { Form } from '@/components/ui/form';
import { useWelpingPuppyForm } from './hooks/useWelpingPuppyForm';
import { CustomButton } from '@/components/ui/custom-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './tabs/BasicInfoTab';
import AkcIdentificationTab from './tabs/AkcIdentificationTab';

interface WelpingPuppyFormProps {
  litterId: string;
  onSuccess: () => Promise<void>;
}

const WelpingPuppyForm: React.FC<WelpingPuppyFormProps> = ({ 
  litterId,
  onSuccess
}) => {
  const { form, isSubmitting, handleSubmit, puppyCount } = useWelpingPuppyForm({ 
    litterId, 
    onSuccess 
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="akc">AKC & Identification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <BasicInfoTab form={form} />
          </TabsContent>
          
          <TabsContent value="akc" className="space-y-4">
            <AkcIdentificationTab form={form} />
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex justify-end pt-2">
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth={false}
          >
            Record Puppy
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default WelpingPuppyForm;
