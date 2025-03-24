
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/imageOptimization';

interface Photo {
  id: string;
  url: string;
  created_at: string;
}

export const usePhotoGallery = (dogId: string) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [viewLargeImage, setViewLargeImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch dog photos
  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ['dogPhotos', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_photos')
        .select('*')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: 'Error fetching photos',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data || [];
    },
  });

  // Upload photo mutation
  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      setUploading(true);
      try {
        const originalSize = file.size;

        // Validate file size before compression (max 20 MB)
        if (originalSize > 20 * 1024 * 1024) {
          throw new Error('Maximum file size is 20MB before compression');
        }
        
        // Show toast for large files
        if (originalSize > 5 * 1024 * 1024) {
          toast({
            title: 'Compressing image...',
            description: 'Large image detected. Compressing to optimize file size.',
          });
        }
        
        // Apply compression with progressive settings based on file size
        let compressedFile: File;
        
        if (originalSize > 10 * 1024 * 1024) {
          // Very large file - aggressive compression
          compressedFile = await compressImage(file, 1200, 0.6, 0.5);
        } else if (originalSize > 5 * 1024 * 1024) {
          // Large file - medium compression
          compressedFile = await compressImage(file, 1600, 0.7, 0.8);
        } else {
          // Normal file - standard compression
          compressedFile = await compressImage(file, 1920, 0.85, 1);
        }
        
        // Generate a unique file name
        const fileName = `${dogId}_${Date.now()}_${file.name}`;
        
        // Upload compressed file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('dog-photos')
          .upload(fileName, compressedFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('dog-photos')
          .getPublicUrl(fileName);

        // Insert into dog_photos table
        const { error: insertError } = await supabase
          .from('dog_photos')
          .insert([
            { dog_id: dogId, url: publicUrl }
          ]);

        if (insertError) {
          throw insertError;
        }

        return publicUrl;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Photo uploaded',
        description: 'The photo has been optimized and added to the gallery',
      });
      queryClient.invalidateQueries({ queryKey: ['dogPhotos', dogId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload photo',
        variant: 'destructive',
      });
    }
  });

  // Delete photo mutation
  const deletePhoto = useMutation({
    mutationFn: async (photoId: string) => {
      const { data, error } = await supabase
        .from('dog_photos')
        .delete()
        .eq('id', photoId);
      
      if (error) throw new Error(error.message);
      return photoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogPhotos', dogId] });
      toast({
        title: 'Photo deleted',
        description: 'Photo has been successfully removed',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting photo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Set as profile photo
  const setAsProfilePhoto = useMutation({
    mutationFn: async (photoUrl: string) => {
      const { error } = await supabase
        .from('dogs')
        .update({ photo_url: photoUrl })
        .eq('id', dogId);
      
      if (error) throw new Error(error.message);
      return photoUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast({
        title: 'Profile photo updated',
        description: 'Photo has been set as the profile picture',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating profile photo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    await uploadPhoto.mutateAsync(file);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      deletePhoto.mutate(photoId);
    }
  };

  const handleSetAsProfilePhoto = (photoUrl: string) => {
    setAsProfilePhoto.mutate(photoUrl);
  };

  return {
    photos,
    isLoading,
    uploading,
    viewLargeImage,
    setViewLargeImage,
    handleFileChange,
    handleDeletePhoto,
    handleSetAsProfilePhoto,
    uploadPhoto
  };
};
