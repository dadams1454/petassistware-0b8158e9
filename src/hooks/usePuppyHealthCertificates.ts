
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HealthCertificate } from '@/types/health';

export const usePuppyHealthCertificates = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch health certificates
  const { 
    data: certificates = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['health-certificates', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppy_health_certificates')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data as HealthCertificate[];
    },
    enabled: !!puppyId
  });

  // Add certificate
  const addCertificate = useMutation({
    mutationFn: async (
      certificateData: Omit<HealthCertificate, 'id' | 'created_at'> & { file?: File }
    ) => {
      setIsUploading(true);
      try {
        let fileUrl = certificateData.file_url;

        // Upload file if provided
        if (certificateData.file) {
          const fileName = `${puppyId}/${Date.now()}-${certificateData.file.name}`;
          const { data: fileData, error: fileError } = await supabase.storage
            .from('health_certificates')
            .upload(fileName, certificateData.file);
          
          if (fileError) throw fileError;
          
          // Get public URL for the file
          const { data: { publicUrl } } = supabase.storage
            .from('health_certificates')
            .getPublicUrl(fileName);
          
          fileUrl = publicUrl;
        }
        
        // Insert certificate record
        const { data, error } = await supabase
          .from('puppy_health_certificates')
          .insert({
            puppy_id: puppyId,
            certificate_type: certificateData.certificate_type,
            issue_date: certificateData.issue_date,
            expiry_date: certificateData.expiry_date,
            issuer: certificateData.issuer,
            file_url: fileUrl,
            notes: certificateData.notes
          })
          .select();
          
        if (error) throw error;
        return data[0] as HealthCertificate;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Certificate Added",
        description: "Health certificate has been added successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['health-certificates', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add certificate: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Update certificate
  const updateCertificate = useMutation({
    mutationFn: async (
      { id, certificateData }: { 
        id: string; 
        certificateData: Partial<HealthCertificate> & { file?: File } 
      }
    ) => {
      setIsUploading(true);
      try {
        let fileUrl = certificateData.file_url;

        // Upload new file if provided
        if (certificateData.file) {
          const fileName = `${puppyId}/${Date.now()}-${certificateData.file.name}`;
          const { data: fileData, error: fileError } = await supabase.storage
            .from('health_certificates')
            .upload(fileName, certificateData.file);
          
          if (fileError) throw fileError;
          
          // Get public URL for the file
          const { data: { publicUrl } } = supabase.storage
            .from('health_certificates')
            .getPublicUrl(fileName);
          
          fileUrl = publicUrl;
        }
        
        // Update the certificate record
        const updateData: Partial<HealthCertificate> = {
          ...certificateData
        };
        
        if (fileUrl) {
          updateData.file_url = fileUrl;
        }
        
        // Remove the file property as it's not in the database schema
        delete (updateData as any).file;
        
        const { data, error } = await supabase
          .from('puppy_health_certificates')
          .update(updateData)
          .eq('id', id)
          .select();
          
        if (error) throw error;
        return data[0] as HealthCertificate;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Certificate Updated",
        description: "Health certificate has been updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['health-certificates', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update certificate: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Delete certificate
  const deleteCertificate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('puppy_health_certificates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Certificate Deleted",
        description: "Health certificate has been deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['health-certificates', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete certificate: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Get certificate types for dropdown options
  const certificateTypes = [
    "AKC Registration",
    "Health Clearance",
    "Vaccination Record",
    "Microchip Registration",
    "DNA Test",
    "Genetic Testing",
    "Breeding Rights",
    "Show Certificate",
    "Travel Certificate",
    "Insurance Document",
    "Other"
  ];

  return {
    certificates,
    isLoading,
    error,
    isUploading,
    refetch,
    certificateTypes,
    addCertificate: addCertificate.mutateAsync,
    updateCertificate: updateCertificate.mutateAsync,
    deleteCertificate: deleteCertificate.mutateAsync
  };
};
