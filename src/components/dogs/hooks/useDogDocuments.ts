
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogDocument } from '../types/document';
import { FormValues } from '../components/documentation/DocumentDialog';

export const useDogDocuments = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DogDocument | null>(null);

  // Fetch documents for a dog
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
        throw error;
      }
      
      return data as DogDocument[];
    },
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: async ({ values, file }: { values: FormValues; file: File }) => {
      // First upload the file to storage
      const fileName = `${dogId}_${Date.now()}_${file.name}`;
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('dog-documents')
        .upload(fileName, file);
      
      if (fileError) {
        throw fileError;
      }
      
      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('dog-documents')
        .getPublicUrl(fileName);
      
      // Now insert the document record
      const { data, error } = await supabase
        .from('dog_documents')
        .insert([
          { 
            dog_id: dogId,
            document_type: values.document_type,
            title: values.title,
            notes: values.notes,
            file_url: publicUrl,
            file_name: file.name
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dogDocuments', dogId],
      });
      
      toast({
        title: 'Document added',
        description: 'The document has been successfully added',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding document',
        description: error.message || 'An error occurred while adding the document',
        variant: 'destructive',
      });
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async ({ documentId, values }: { documentId: string; values: FormValues }) => {
      const { data, error } = await supabase
        .from('dog_documents')
        .update({ 
          document_type: values.document_type,
          title: values.title,
          notes: values.notes,
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dogDocuments', dogId],
      });
      
      toast({
        title: 'Document updated',
        description: 'The document has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating document',
        description: error.message || 'An error occurred while updating the document',
        variant: 'destructive',
      });
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      // First get the document to find the file path
      const { data: document, error: fetchError } = await supabase
        .from('dog_documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Extract the file path from the URL
      const filePath = document.file_url.split('/').pop();
      
      // Delete the document record
      const { error: deleteError } = await supabase
        .from('dog_documents')
        .delete()
        .eq('id', documentId);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Delete the file from storage (if file path can be extracted)
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('dog-documents')
          .remove([filePath]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue even if file deletion fails
        }
      }
      
      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dogDocuments', dogId],
      });
      
      toast({
        title: 'Document deleted',
        description: 'The document has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting document',
        description: error.message || 'An error occurred while deleting the document',
        variant: 'destructive',
      });
    },
  });

  const openAddDocument = () => {
    setIsAddDocumentOpen(true);
  };

  const closeAddDocument = () => {
    setIsAddDocumentOpen(false);
  };

  const openEditDocument = (document: DogDocument) => {
    setDocumentToEdit(document);
    setIsEditDocumentOpen(true);
  };

  const closeEditDocument = () => {
    setIsEditDocumentOpen(false);
    setDocumentToEdit(null);
  };

  const handleSaveDocument = async (values: FormValues, file?: File) => {
    if (!file) {
      throw new Error('No file selected');
    }
    
    await addDocumentMutation.mutateAsync({ values, file });
  };

  const handleUpdateDocument = async (values: FormValues) => {
    if (!documentToEdit) {
      throw new Error('No document selected for editing');
    }
    
    await updateDocumentMutation.mutateAsync({ 
      documentId: documentToEdit.id, 
      values 
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocumentMutation.mutate(documentId);
    }
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
