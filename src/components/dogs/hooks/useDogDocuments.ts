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

  // Format file size in a human-readable way
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Process file before upload (compress if possible)
  const processFile = async (file: File): Promise<File> => {
    const isImage = file.type.startsWith('image/');
    
    // For images, apply compression
    if (isImage) {
      // Display original size
      const originalSize = file.size;
      
      // Apply different compression levels based on file size
      let compressedFile: File;
      
      if (originalSize > 5 * 1024 * 1024) {
        // Very large image - aggressive compression
        toast({
          title: 'Large image detected',
          description: 'Applying compression to reduce file size...',
        });
        compressedFile = await compressImage(file, 1200, 0.6, 0.6);
      } else if (originalSize > 2 * 1024 * 1024) {
        // Medium size image - moderate compression
        compressedFile = await compressImage(file, 1600, 0.75, 0.8);
      } else {
        // Small image - light compression to preserve quality
        compressedFile = await compressImage(file, 1920, 0.85, 1);
      }
      
      // Show reduction in file size
      const compressionRatio = (1 - (compressedFile.size / originalSize)) * 100;
      if (compressionRatio > 10) {
        toast({
          title: 'Image compressed',
          description: `Reduced by ${compressionRatio.toFixed(0)}% (${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)})`,
        });
      }
      
      return compressedFile;
    }
    
    // For non-images, just return the original file
    return file;
  };

  // Mutation to save a new document
  const saveMutation = useMutation({
    mutationFn: async (documentData: Omit<DogDocument, 'id' | 'created_at'> & { file?: File }) => {
      // If there's a file, upload it first
      let fileUrl = documentData.file_url;
      let fileName = documentData.file_name || '';
      
      if (documentData.file) {
        try {
          // Process file (compress if it's an image)
          const processedFile = await processFile(documentData.file);
          
          // Generate unique filename
          fileName = `${Date.now()}_${documentData.file.name}`;
          
          // Upload file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('dog-documents')
            .upload(fileName, processedFile);
            
          if (uploadError) throw new Error(uploadError.message);
          
          // Get public URL
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
      
      // Insert document record
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
    mutationFn: async (payload: { documentId: string, values: Partial<DogDocument> & { file?: File } }) => {
      const { documentId, values } = payload;
      
      // If there's a new file, upload it
      if (values.file) {
        try {
          // Process file (compress if it's an image)
          const processedFile = await processFile(values.file);
          
          // Generate unique filename
          const fileName = `${Date.now()}_${values.file.name}`;
          
          // Upload file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('dog-documents')
            .upload(fileName, processedFile);
            
          if (uploadError) throw new Error(uploadError.message);
          
          // Get public URL
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
      
      // Remove the file property before updating
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
  const handleSaveDocument = async (data: any, file?: File): Promise<void> => {
    await saveMutation.mutateAsync(data);
  };
  
  const handleUpdateDocument = async (data: any, file?: File): Promise<void> => {
    if (!documentToEdit) return;
    await updateMutation.mutateAsync({ documentId: documentToEdit.id, values: data });
  };
  
  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(documentId);
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
