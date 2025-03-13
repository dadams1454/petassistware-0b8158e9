
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextInput from '@/components/dogs/form/TextInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import DogSelector from './DogSelector';
import LitterDatePicker from './LitterDatePicker';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { UseFormReturn } from 'react-hook-form';
import { LitterFormData } from '../hooks/useLitterForm';

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
          
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput 
                form={form} 
                name="litter_name" 
                label="Friendly Litter Name" 
                placeholder="Enter a descriptive name for this litter (e.g., 'Rainbow Litter')" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput 
                  form={form} 
                  name="puppy_count" 
                  label="Total Puppies" 
                  placeholder="Number of puppies"
                  disabled={true}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TextInput 
                    form={form} 
                    name="male_count" 
                    label="Males" 
                    placeholder="Male count" 
                  />
                  <TextInput 
                    form={form} 
                    name="female_count" 
                    label="Females" 
                    placeholder="Female count" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DogSelector 
                form={form} 
                name="dam_id" 
                label="Dam (Mother)" 
                filterGender="Female" 
              />
              
              <DogSelector 
                form={form} 
                name="sire_id" 
                label="Sire (Father)" 
                filterGender="Male" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LitterDatePicker 
                form={form}
                name="birth_date"
                label="Birth Date" 
              />
              
              <LitterDatePicker 
                form={form}
                name="expected_go_home_date"
                label="Expected Go-Home Date" 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="akc" className="space-y-6">
            <div className="bg-purple-50 rounded-md p-4 mb-4">
              <h3 className="text-purple-800 font-medium">AKC Registration Information</h3>
              <p className="text-sm text-purple-700 mt-1">Enter AKC registration details for proper documentation and compliance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput 
                form={form} 
                name="akc_registration_number" 
                label="AKC Litter Registration Number" 
                placeholder="Enter official AKC litter registration number" 
              />
              
              <LitterDatePicker 
                form={form}
                name="akc_registration_date"
                label="AKC Registration Date" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput 
                form={form} 
                name="akc_breeder_id" 
                label="AKC Breeder ID" 
                placeholder="Your AKC breeder identification" 
              />
              
              <TextInput 
                form={form} 
                name="akc_litter_color" 
                label="Litter Colors/Markings" 
                placeholder="Primary colors/markings in this litter" 
              />
            </div>
            
            <PhotoUpload 
              form={form} 
              name="akc_documents_url" 
              label="AKC Registration Documents" 
            />
          </TabsContent>
          
          <TabsContent value="breeding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Mating Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LitterDatePicker 
                    form={form}
                    name="first_mating_date"
                    label="First Mating Date" 
                  />
                  
                  <LitterDatePicker 
                    form={form}
                    name="last_mating_date"
                    label="Last Mating Date" 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Breeder Information</h3>
                <TextInput 
                  form={form} 
                  name="kennel_name" 
                  label="Kennel Name" 
                  placeholder="Your registered kennel name" 
                />
              </div>
            </div>
            
            <Separator />
            
            <TextareaInput 
              form={form} 
              name="breeding_notes" 
              label="Breeding Notes" 
              placeholder="Enter any notes about the breeding process" 
            />
            
            <TextareaInput 
              form={form} 
              name="notes" 
              label="Litter Notes" 
              placeholder="Enter any general notes about this litter" 
            />

            <PhotoUpload 
              form={form} 
              name="documents_url" 
              label="Litter Documents (Health records, pedigrees, etc.)" 
            />
          </TabsContent>
        </Tabs>

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
            {isEditMode ? 'Update Litter' : 'Create Litter'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default LitterFormLayout;
