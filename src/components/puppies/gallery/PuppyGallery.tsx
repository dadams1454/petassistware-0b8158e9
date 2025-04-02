
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PuppyPhoto } from '@/types/puppy';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Trash2, Star } from 'lucide-react';
import { compressImage } from '@/utils/imageOptimization';

interface PuppyGalleryProps {
  puppyId: string;
  mainPhotoUrl?: string | null;
  onMainPhotoChange?: (url: string) => void;
}

const PuppyGallery: React.FC<PuppyGalleryProps> = ({ 
  puppyId, 
  mainPhotoUrl,
  onMainPhotoChange 
}) => {
  const [photos, setPhotos] = useState<PuppyPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPuppyPhotos();
  }, [puppyId]);
  
  const fetchPuppyPhotos = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('puppy_photos')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPhotos(data as PuppyPhoto[]);
    } catch (error) {
      console.error('Error fetching puppy photos:', error);
      toast({
        title: 'Error',
        description: 'Could not load puppy photos',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    await uploadImage(file);
    
    // Clear the input value to allow the same file to be selected again
    event.target.value = '';
  };
  
  const uploadImage = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Compress the image before uploading
      const compressedFile = await compressImage(file, 1200, 0.8);
      
      // Create storage path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `puppies/${puppyId}/photos/${fileName}`;

      // Upload image to Supabase storage
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
      
      // Insert the photo into the puppy_photos table
      const { data: photoData, error: insertError } = await supabase
        .from('puppy_photos')
        .insert({
          puppy_id: puppyId,
          photo_url: url,
          is_main: false // Not the main photo by default
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Add the new photo to the state
      setPhotos(prevPhotos => [photoData as PuppyPhoto, ...prevPhotos]);
      
      toast({
        title: 'Photo uploaded',
        description: 'The photo has been added to the gallery',
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
    }
  };
  
  const handleDeletePhoto = async (photoId: string, photoUrl: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = photoUrl.split('/');
      const storagePathIndex = urlParts.indexOf('dog-photos') + 1;
      
      if (storagePathIndex > 0 && storagePathIndex < urlParts.length) {
        const storagePath = urlParts.slice(storagePathIndex).join('/');
        
        // Delete the file from storage
        await supabase.storage
          .from('dog-photos')
          .remove([storagePath]);
      }
      
      // Delete from the database
      const { error } = await supabase
        .from('puppy_photos')
        .delete()
        .eq('id', photoId);
        
      if (error) throw error;
      
      // Remove from state
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
      
      // If this was the main photo, we need to update the puppy record
      if (photoUrl === mainPhotoUrl && onMainPhotoChange) {
        // Find a new main photo or set to null
        const newMainPhoto = photos.find(photo => photo.id !== photoId);
        if (newMainPhoto) {
          onMainPhotoChange(newMainPhoto.photo_url);
        } else {
          onMainPhotoChange('');
        }
      }
      
      toast({
        title: 'Photo deleted',
        description: 'The photo has been removed from the gallery',
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the photo',
        variant: 'destructive',
      });
    }
  };
  
  const setAsMainPhoto = async (photoId: string, photoUrl: string) => {
    try {
      // Update is_main flag in puppy_photos table
      const { error: updateError } = await supabase
        .from('puppy_photos')
        .update({ is_main: true })
        .eq('id', photoId);
        
      if (updateError) throw updateError;
      
      // Reset is_main flag for all other photos
      const { error: resetError } = await supabase
        .from('puppy_photos')
        .update({ is_main: false })
        .eq('puppy_id', puppyId)
        .neq('id', photoId);
        
      if (resetError) throw resetError;
      
      // Update the main photo in the puppies table
      if (onMainPhotoChange) {
        onMainPhotoChange(photoUrl);
      }
      
      // Update local state
      setPhotos(prevPhotos => prevPhotos.map(photo => ({
        ...photo,
        is_main: photo.id === photoId
      })));
      
      toast({
        title: 'Main photo updated',
        description: 'The profile photo has been updated',
      });
    } catch (error) {
      console.error('Error setting main photo:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating the main photo',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Puppy Photos</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => document.getElementById('gallery-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
          <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button 
            size="sm" 
            onClick={() => document.getElementById('gallery-capture')?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
          <input
            id="gallery-capture"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
          Uploading photo...
        </div>
      )}
      
      {photos.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <p className="text-gray-500">No photos yet. Upload or take a photo to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border">
                <img 
                  src={photo.photo_url} 
                  alt="Puppy" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-1">
                  {photo.photo_url !== mainPhotoUrl && (
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8" 
                      onClick={() => setAsMainPhoto(photo.id, photo.photo_url)}
                      title="Set as main photo"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8" 
                    onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                    title="Delete photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {photo.photo_url === mainPhotoUrl && (
                <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1" title="Main photo">
                  <Star className="h-3 w-3 fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PuppyGallery;
