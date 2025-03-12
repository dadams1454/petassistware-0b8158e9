
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogDocument } from '../types/document';
import { processDocumentFile } from '../utils/documentFileUtils';

export const useDocumentMutations = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (documentData: Omit<DogDocument, 'id' | 'created_at'> & { file?: File }) => {
      let fileUrl = documentData.file_url;
      let fileName = documentData.file_name || '';
      
      if (documentData.file) {
        try {
          const processedFile = await processDocumentFile(documentData.file);
          fileName = `${Date.now()}_${documentData.file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('dog-documents')
            .upload(fileName, processedFile);
            
          if (uploadError) throw new Error(uploadError.message);
          
          const { data: urlData } = supabase.storage
            .from('dog-documents')
            .getPublicUrl(fileName);
            
          fileUrl = urlData.publicUrl;
        } catch (error: any) {
          toast({
            title: 'Error uploading file',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
      }
      
      const { data: responseData, error } = await supabase
        .from('dog_documents')
        .insert([{
          dog_id: dogId,
          document_type: documentData.document_type,
          title: documentData.title,
          file_url: fileUrl,
          file_name: fileName,
          notes: documentData.notes
        }])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogDocuments', dogId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { documentId: string, values: Partial<DogDocument> & { file?: File } }) => {
      const { documentId, values } = payload;
      
      if (values.file) {
        try {
          const processedFile = await processDocumentFile(values.file);
          const fileName = `${Date.now()}_${values.file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('dog-documents')
            .upload(fileName, processedFile);
            
          if (uploadError) throw new Error(uploadError.message);
          
          const { data: urlData } = supabase.storage
            .from('dog-documents')
            .getPublicUrl(fileName);
            
          values.file_url = urlData.publicUrl;
          values.file_name = fileName;
        } catch (error: any) {
          toast({
            title: 'Error uploading file',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
      }
      
      const { file, ...updateData } = values;
      
      const { data: responseData, error } = await supabase
        .from('dog_documents')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogDocuments', dogId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('dog_documents')
        .delete()
        .eq('id', documentId);
        
      if (error) throw new Error(error.message);
      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogDocuments', dogId] });
    }
  });

  return {
    saveMutation,
    updateMutation,
    deleteMutation
  };
};
