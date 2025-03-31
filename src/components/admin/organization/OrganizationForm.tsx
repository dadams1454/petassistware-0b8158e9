
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { isValidUUID } from '@/utils/uuidUtils';
import UuidField from './UuidField';

interface OrganizationFormData {
  name: string;
  description: string;
  tenantId: string;
}

interface OrganizationFormProps {
  initialData: {
    name?: string;
    description?: string;
    id?: string;
  };
  onSubmit: (data: OrganizationFormData) => Promise<void>;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ initialData, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OrganizationFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      tenantId: initialData?.id || ''
    }
  });
  
  // Watch the tenant ID field
  const tenantId = watch('tenantId');
  
  const handleFormSubmit = async (data: OrganizationFormData) => {
    // Final UUID validation before submission
    if (!isValidUUID(data.tenantId)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        // Ensure tenantId is clean and valid
        tenantId: data.tenantId.trim()
      });
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTenantIdChange = (value: string) => {
    setValue('tenantId', value);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            placeholder="Your Organization Name"
            {...register('name', { required: "Organization name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message?.toString()}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Organization Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your organization"
            className="min-h-[100px]"
            {...register('description')}
          />
        </div>
        
        <UuidField 
          value={tenantId}
          onChange={handleTenantIdChange}
          error={errors.tenantId?.message?.toString()}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !isValidUUID(tenantId)}
        >
          {isSubmitting ? "Saving..." : "Save Organization Settings"}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationForm;
