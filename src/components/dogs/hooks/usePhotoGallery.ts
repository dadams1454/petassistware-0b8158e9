
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const { data, error } = await supabase
        .from('dog_photos')
        .delete()
        .eq('id', photoId);
      
      if (error) throw new Error(error.message);
      return photoId;
    },
    onSuccess: () => {
      refetch();
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024;

      // Validate file size (max 5 MB)
      if (fileSize > 5) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB',
          variant: 'destructive',
        });
        return;
      }

      setUploading(true);
      
      // Compress the image before upload
      const compressedFile = await compressImage(file, 1920, 0.85, 1);
      
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

      refetch();
      toast({
        title: 'Photo uploaded',
        description: 'The photo has been optimized and added to the gallery',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload photo',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      deletePhotoMutation.mutate(photoId);
    }
  };

  return {
    photos,
    isLoading,
    uploading,
    viewLargeImage,
    setViewLargeImage,
    handleFileChange,
    handleDeletePhoto
  };
};
