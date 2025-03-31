
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { isValidUUID, validateUUID, attemptUUIDRepair, generateUUID } from '@/utils/uuidUtils';
import { AlertTriangle, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface OrganizationSetupProps {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
}

const OrganizationSetup: React.FC<OrganizationSetupProps> = ({ initialData, onSubmit }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uuidValidation, setUuidValidation] = useState<{valid: boolean, error: string | null}>({ valid: true, error: null });
  const [showUuidGuide, setShowUuidGuide] = useState(false);
  
  // Generate a valid UUID if one doesn't exist
  const generateTenantId = () => {
    const newTenantId = generateUUID();
    setValue('tenantId', newTenantId);
    setUuidValidation({ valid: true, error: null });
    
    // Validate immediately after generation to ensure it's valid
    const validation = validateUUID(newTenantId);
    if (!validation.valid) {
      console.error('Generated UUID failed validation:', validation.error);
      toast({
        title: "UUID Generation Error",
        description: "Failed to generate a valid UUID. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Tenant ID Generated",
      description: "A new valid UUID has been generated.",
      variant: "default"
    });
  };
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      tenantId: initialData?.id || ''
    }
  });
  
  // Watch the tenant ID field for validation
  const tenantId = watch('tenantId');
  
  // Always force generate a new UUID if the current one is invalid
  useEffect(() => {
    if (!initialData?.id || !isValidUUID(initialData?.id)) {
      // Automatically generate a valid UUID if none exists or current is invalid
      generateTenantId();
    }
  }, [initialData]);
  
  useEffect(() => {
    if (tenantId) {
      // Clean and validate the UUID
      const result = validateUUID(tenantId);
      setUuidValidation(result);
      
      // If invalid, try to repair and suggest
      if (!result.valid) {
        const repairedUuid = attemptUUIDRepair(tenantId);
        if (repairedUuid) {
          setUuidValidation({
            valid: false,
            error: `Invalid format. Did you mean: ${repairedUuid}?`
          });
        }
      }
    } else {
      setUuidValidation({ valid: false, error: "Tenant ID is required" });
    }
  }, [tenantId]);
  
  const handleTenantIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // First try to clean up the input
    const rawValue = e.target.value;
    const cleanedValue = rawValue.trim().replace(/\s+/g, '');
    
    setValue('tenantId', cleanedValue);
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
      const cleaned = pastedText.trim().replace(/\s+/g, '');
      
      if (!isValidUUID(cleaned)) {
        const repaired = attemptUUIDRepair(cleaned);
        if (repaired) {
          e.preventDefault();
          setValue('tenantId', repaired);
          toast({
            title: "UUID Format Corrected",
            description: "The pasted UUID had formatting issues and was automatically fixed.",
            variant: "default"
          });
        } else {
          toast({
            title: "Invalid UUID Format",
            description: "The pasted value is not a valid UUID and cannot be repaired. Please generate a new UUID.",
            variant: "destructive"
          });
        }
      }
    }
  };
  
  const handleFormSubmit = async (data: any) => {
    // Final UUID validation before submission
    if (!isValidUUID(data.tenantId)) {
      toast({
        title: "Invalid UUID Format",
        description: "Please use the Generate New ID button to create a valid UUID.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        // Ensure tenantId is clean and valid
        tenantId: data.tenantId.trim()
      });
      toast({
        title: "Organization Updated",
        description: "Your organization settings have been saved successfully.",
        variant: "default"
      });
    } catch (error: any) {
      // If there's a UUID error, force regenerate
      if (error.message?.includes('UUID') || error.message?.includes('uuid')) {
        generateTenantId();
        toast({
          title: "UUID Error",
          description: "A new UUID has been generated. Please try saving again.",
          variant: "warning"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update organization settings.",
          variant: "destructive"
        });
      }
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
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New ID
            </Button>
          </div>
          <div className="relative">
            <Input
              id="tenantId"
              placeholder="UUID format tenant ID"
              value={tenantId}
              onChange={handleTenantIdChange}
              onPaste={handlePaste}
              onFocus={() => setShowUuidGuide(true)}
              onBlur={() => setShowUuidGuide(false)}
              className={`${!uuidValidation.valid ? 'border-destructive' : ''} pr-10`}
              {...register('tenantId', { 
                required: "Tenant ID is required",
                validate: value => isValidUUID(value) || "Must be a valid UUID format"
              })}
            />
            {tenantId && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {uuidValidation.valid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            )}
          </div>
          
          {!uuidValidation.valid && (
            <div className="text-sm text-destructive flex items-center gap-1 mt-1">
              <AlertTriangle className="h-4 w-4" />
              <span>{uuidValidation.error}</span>
            </div>
          )}
          
          <div className="border border-gray-200 rounded-md p-3 mt-2 bg-gray-50 text-xs">
            <p className="font-medium mb-1">UUID format guide:</p>
            <p className="font-mono">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
            <p className="mt-1">Example: 123e4567-e89b-12d3-a456-426614174000</p>
            <p className="mt-1 text-muted-foreground">
              <span className="font-medium">Important:</span> Click "Generate New ID" to create a valid UUID - this is the safest approach.
            </p>
          </div>
          
          {errors.tenantId && (
            <p className="text-sm text-destructive">{errors.tenantId.message?.toString()}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !uuidValidation.valid}
        >
          {isSubmitting ? "Saving..." : "Save Organization Settings"}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationSetup;
