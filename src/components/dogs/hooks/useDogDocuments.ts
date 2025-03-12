
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogDocument } from '../types/document';
import { useDocumentMutations } from './useDocumentMutations';

export const useDogDocuments = (dogId: string) => {
  const { toast } = useToast();
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DogDocument | null>(null);
  
  const { saveMutation, updateMutation, deleteMutation } = useDocumentMutations(dogId);

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

  // Document operations with toast notifications
  const handleSaveDocument = async (data: any, file?: File): Promise<void> => {
    try {
      await saveMutation.mutateAsync(data);
      setIsAddDocumentOpen(false);
      toast({
        title: 'Document added',
        description: 'Document has been successfully added',
      });
    } catch (error: any) {
      toast({
        title: 'Error adding document',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateDocument = async (data: any, file?: File): Promise<void> => {
    if (!documentToEdit) return;
    try {
      await updateMutation.mutateAsync({ documentId: documentToEdit.id, values: data });
      setIsEditDocumentOpen(false);
      setDocumentToEdit(null);
      toast({
        title: 'Document updated',
        description: 'Document has been successfully updated',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating document',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(documentId);
      toast({
        title: 'Document deleted',
        description: 'Document has been successfully deleted',
      });
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
