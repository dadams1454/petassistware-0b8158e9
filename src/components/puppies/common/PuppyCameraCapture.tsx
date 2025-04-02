
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/imageOptimization';

interface PuppyCameraCaptureProps {
  puppyId: string;
  currentPhotoUrl?: string | null;
  onPhotoUploaded: (url: string) => void;
  showRemoveButton?: boolean;
  className?: string;
}

const PuppyCameraCapture: React.FC<PuppyCameraCaptureProps> = ({
  puppyId,
  currentPhotoUrl,
  onPhotoUploaded,
  showRemoveButton = true,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update photoUrl when currentPhotoUrl changes
  useEffect(() => {
    if (currentPhotoUrl !== undefined) {
      setPhotoUrl(currentPhotoUrl);
    }
  }, [currentPhotoUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);

      // Compress the image before uploading
      console.log('Compressing image...');
      const compressedFile = await compressImage(file, 1200, 0.8);
      
      // Create storage path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `puppies/${puppyId}/photos/${fileName}`;

      // Upload image to Supabase storage
      console.log('Uploading to:', filePath);
      const { data, error } = await supabase.storage
        .from('dog-photos')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(filePath);

      const url = publicUrlData.publicUrl;
      
      // Store the URL in state
      setPhotoUrl(url);
      
      // Check if this is the first photo, and if so, set it as the main photo in the puppy record
      if (!currentPhotoUrl) {
        // Update the puppy's photo_url if this is the first photo
        const { error: updateError } = await supabase
          .from('puppies')
          .update({ photo_url: url })
          .eq('id', puppyId);
          
        if (updateError) {
          console.error('Error updating puppy photo_url:', updateError);
        }
      }
      
      // Insert the photo into the puppy_photos table
      const { error: insertError } = await supabase
        .from('puppy_photos')
        .insert({
          puppy_id: puppyId,
          photo_url: url,
          is_main: !currentPhotoUrl // Set as main photo if there's no current photo
        });
        
      if (insertError) {
        console.error('Error inserting into puppy_photos:', insertError);
      }

      // Notify the parent component
      onPhotoUploaded(url);
      
      toast({
        title: 'Photo uploaded',
        description: 'Your photo has been uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your photo',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Clear the file input value to allow the same file to be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    if (!photoUrl) return;

    try {
      setIsUploading(true);
      
      // Extract the file path from the URL
      const urlParts = photoUrl.split('/');
      const storagePathIndex = urlParts.indexOf('dog-photos') + 1;
      
      if (storagePathIndex > 0 && storagePathIndex < urlParts.length) {
        const storagePath = urlParts.slice(storagePathIndex).join('/');
        
        // Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from('dog-photos')
          .remove([storagePath]);
          
        if (storageError) {
          console.error('Error removing from storage:', storageError);
        }
      }
      
      // Remove from the puppy_photos table
      const { error: deleteError } = await supabase
        .from('puppy_photos')
        .delete()
        .eq('photo_url', photoUrl);
        
      if (deleteError) {
        console.error('Error deleting from puppy_photos:', deleteError);
      }

      // Update the puppy record if this is the main photo
      const { error: updateError } = await supabase
        .from('puppies')
        .update({ photo_url: null })
        .eq('id', puppyId)
        .eq('photo_url', photoUrl);
        
      if (updateError) {
        console.error('Error updating puppy photo_url:', updateError);
      }

      // Clear the photo URL
      setPhotoUrl(null);
      onPhotoUploaded('');
      
      toast({
        title: 'Photo removed',
        description: 'Your photo has been removed successfully',
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: 'Removal failed',
        description: 'There was an error removing your photo',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="w-40 h-40 relative bg-gray-100 rounded-md overflow-hidden">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt="Puppy" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleCaptureClick} 
          disabled={isUploading}
        >
          <Camera className="h-4 w-4 mr-1" />
          Capture
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
        
        {showRemoveButton && photoUrl && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleRemovePhoto} 
            disabled={isUploading}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
    </div>
  );
};

export default PuppyCameraCapture;
