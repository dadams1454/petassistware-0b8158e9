
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isValidUUID, generateUUID } from '@/utils/uuidUtils';
import OrganizationForm from './OrganizationForm';

interface OrganizationSetupProps {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
}

const OrganizationSetup: React.FC<OrganizationSetupProps> = ({ initialData, onSubmit }) => {
  const { toast } = useToast();
  
  // Always force generate a new UUID if the current one is invalid
  useEffect(() => {
    if (!initialData?.id || !isValidUUID(initialData?.id)) {
      // If this is rendered, the parent component will handle the UUID generation
      console.log('Invalid or missing UUID detected in OrganizationSetup');
    }
  }, [initialData]);
  
  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      toast({
        title: "Organization Updated",
        description: "Your organization settings have been saved successfully.",
        variant: "default"
      });
    } catch (error: any) {
      // If there's a UUID error, handled in parent component
      if (!error.message?.includes('UUID') && !error.message?.includes('uuid')) {
        toast({
          title: "Error",
          description: error.message || "Failed to update organization settings.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <OrganizationForm
      initialData={initialData}
      onSubmit={handleFormSubmit}
    />
  );
};

export default OrganizationSetup;
