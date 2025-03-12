
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogDocument } from '../types/document';
import { compressImage } from '@/utils/imageOptimization';

export const useDogDocuments = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DogDocument | null>(null);

  // Query to fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['dogDocuments', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_documents')
        .select('*')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: 'Error fetching documents',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data as DogDocument[];
    },
  });

  // Mutation to save a new document
  const saveMutation = useMutation({
    mutationFn: async (documentData: Omit<DogDocument, 'id' | 'created_at'> & { file?: File }) => {
      // If there's a file, upload it first
      let fileUrl = documentData.file_url;
      let fileName = documentData.file_name || '';
      
      if (documentData.file) {
        try {
          // Compress file if it's an image
          const file = documentData.file;
          const isImage = file.type.startsWith('image/');
          
          // Generate unique filename
          fileName = `${Date.now()}_${file.name}`;
          
          let fileToUpload = file;
          
          // Apply compression for images
          if (isImage) {
            // Aggressively compress images to ensure they're within size limits
            fileToUpload = await compressImage(file, 1200, 0.7, 0.8);
            
            // If still too large, compress more
            if (fileToUpload.size > 2 * 1024 * 1024) {
              fileToUpload = await compressImage(file, 800, 0.5, 0.5);
            }
          }
          
          // Upload file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('dog-documents')
            .upload(fileName, fileToUpload);
            
          if (uploadError) throw new Error(uploadError.message);
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('dog-documents')
            .getPublicUrl(fileName);
            
          fileUrl = publicUrl;
        } catch (error: any) {
          toast({
            title: 'Error uploading file',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
      }
      
      // Insert document record
      const { data, error } = await supabase
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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogDocuments', dogId] });
      setIsAddDocumentOpen(false);
      toast({
        title: 'Document added',
        description: 'Document has been successfully added',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error adding document',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Mutation to update an existing document
  const updateMutation = useMutation({
    mutationFn: async (data: { documentId: string, values: Partial<DogDocument> & { file?: File } }) => {
      const { documentId, values } = data;
      
      // If there's a new file, upload it
      if (values.file) {
        try {
          const file = values.file;
          const isImage = file.type.startsWith('image/');
          
          // Generate unique filename
          const fileName = `${Date.now()}_${file.name}`;
          
          let fileToUpload = file;
          
          // Apply compression for images
          if (isImage) {
            // Aggressively compress images to ensure they're within size limits
            fileToUpload = await compressImage(file, 1200, 0.7, 0.8);
            
            // If still too large, compress more
            if (fileToUpload.size > 2 * 1024 * 1024) {
              fileToUpload = await compressImage(file, 800, 0.5, 0.5);
            }
          }
          
          // Upload file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('dog-documents')
            .upload(fileName, fileToUpload);
            
          if (uploadError) throw new Error(uploadError.message);
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('dog-documents')
            .getPublicUrl(fileName);
            
          values.file_url = publicUrl;
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
      
      // Remove the file property before updating
      const { file, ...updateData } = values;
      
      const { data, error } = await supabase
        .from('dog_documents')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogDocuments', dogId] });
      setIsEditDocumentOpen(false);
      setDocumentToEdit(null);
      toast({
        title: 'Document updated',
        description: 'Document has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating document',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Mutation to delete a document
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
      toast({
        title: 'Document deleted',
        description: 'Document has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting document',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Dialog control functions
  const openAddDocument = () => setIsAddDocumentOpen(true);
  const closeAddDocument = () => setIsAddDocumentOpen(false);
  
  const openEditDocument = (document: DogDocument) => {
    setDocumentToEdit(document);
    setIsEditDocumentOpen(true);
  };
  const closeEditDocument = () => {
    setIsEditDocumentOpen(false);
    setDocumentToEdit(null);
  };

  // Document operations
  const handleSaveDocument = (data: any) => {
    saveMutation.mutate(data);
  };
  
  const handleUpdateDocument = (data: any) => {
    if (!documentToEdit) return;
    updateMutation.mutate({ documentId: documentToEdit.id, values: data });
  };
  
  const handleDeleteDocument = (documentId: string) => {
    deleteMutation.mutate(documentId);
  };

  return {
    documents,
    isLoading,
    isAddDocumentOpen,
    isEditDocumentOpen,
    documentToEdit,
    openAddDocument,
    closeAddDocument,
    openEditDocument,
    closeEditDocument,
    handleSaveDocument,
    handleUpdateDocument,
    handleDeleteDocument
  };
};
