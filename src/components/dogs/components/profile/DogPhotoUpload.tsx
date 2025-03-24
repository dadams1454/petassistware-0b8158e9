
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { compressImage } from '@/utils/imageOptimization';

interface DogPhotoUploadProps {
  dogId: string;
  currentPhoto?: string;
  onClose: () => void;
}

const DogPhotoUpload: React.FC<DogPhotoUploadProps> = ({ 
  dogId, 
  currentPhoto, 
  onClose 
}) => {
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
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Upload image to Supabase storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${dogId}_${Date.now()}.${fileExt}`;
      const filePath = `dog_photos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dogs')
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('dogs')
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
      
      onClose();
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
      onClose();
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Extract filename from currentPhoto URL
      const photoPath = currentPhoto.split('/').pop();
      
      if (photoPath) {
        // Delete the file from storage
        const { error: deleteStorageError } = await supabase.storage
          .from('dogs')
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
      
      onClose();
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
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Dog Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {(previewUrl || currentPhoto) && (
            <div className="relative w-40 h-40 mx-auto">
              <img 
                src={previewUrl || currentPhoto} 
                alt="Preview" 
                className="w-full h-full rounded-full object-cover"
              />
              {previewUrl && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0 rounded-full p-1"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-center">
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm">Click to upload a photo</span>
              <input 
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isUploading || (!currentPhoto && !previewUrl)}
          >
            Remove Photo
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Save Photo'}
              {!isUploading && <Check className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DogPhotoUpload;
