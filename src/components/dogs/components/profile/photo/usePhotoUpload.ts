
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { compressImage } from '@/utils/imageOptimization';

export const usePhotoUpload = (dogId: string, currentPhoto?: string, onClose?: () => void) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      try {
        // Compress the image before uploading
        const compressedFile = await compressImage(file);
        setSelectedFile(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        setSelectedFile(file); // Fallback to original file if compression fails
      }
    }
  };

  const clearSelectedFile = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Upload image to Supabase storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${dogId}_${Date.now()}.${fileExt}`;
      const filePath = `dog_photos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(filePath);
      
      if (!publicURL) {
        throw new Error("Couldn't get public URL");
      }
      
      // Update the dog's photo_url in the database
      const { error: updateError } = await supabase
        .from('dogs')
        .update({ photo_url: publicURL.publicUrl })
        .eq('id', dogId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Show success message
      toast({
        title: 'Photo updated',
        description: 'Dog photo has been updated successfully',
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemove = async () => {
    if (!currentPhoto) {
      if (onClose) onClose();
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Extract filename from currentPhoto URL
      const photoPath = currentPhoto.split('/').pop();
      
      if (photoPath) {
        // Delete the file from storage
        const { error: deleteStorageError } = await supabase.storage
          .from('dog-photos')
          .remove([`dog_photos/${photoPath}`]);
        
        if (deleteStorageError) {
          console.warn('Error deleting photo from storage:', deleteStorageError);
          // Continue anyway to update the database
        }
      }
      
      // Update the dog's photo_url in the database to null
      const { error: updateError } = await supabase
        .from('dogs')
        .update({ photo_url: null })
        .eq('id', dogId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Show success message
      toast({
        title: 'Photo removed',
        description: 'Dog photo has been removed successfully',
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: 'Removal failed',
        description: 'Failed to remove photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedFile,
    previewUrl,
    isUploading,
    handleFileChange,
    clearSelectedFile,
    handleUpload,
    handleRemove
  };
};
