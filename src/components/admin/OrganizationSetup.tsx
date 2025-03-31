
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrganizationSetupProps {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
}

const OrganizationSetup: React.FC<OrganizationSetupProps> = ({ initialData, onSubmit }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate a valid UUID if one doesn't exist
  const generateTenantId = () => {
    const newTenantId = uuidv4();
    setValue('tenantId', newTenantId);
    toast({
      title: "Tenant ID Generated",
      description: "A new valid tenant ID has been generated.",
      variant: "default"
    });
  };
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      tenantId: initialData?.id || ''
    }
  });
  
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: "Organization Updated",
        description: "Your organization settings have been saved successfully.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update organization settings.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="tenantId">Tenant ID (UUID format required)</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={generateTenantId}
            >
              Generate New ID
            </Button>
          </div>
          <Input
            id="tenantId"
            placeholder="UUID format tenant ID"
            {...register('tenantId', { 
              required: "Tenant ID is required",
              pattern: {
                value: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                message: "Must be a valid UUID format"
              }
            })}
          />
          {errors.tenantId && (
            <p className="text-sm text-destructive">{errors.tenantId.message?.toString()}</p>
          )}
          <p className="text-xs text-muted-foreground">
            A unique identifier for your organization. Must be in UUID format.
          </p>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Organization Settings"}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationSetup;
