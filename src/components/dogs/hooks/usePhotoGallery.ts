
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadGalleryPhoto } from '../utils/galleryUploadUtils';

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
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    await uploadGalleryPhoto(file, dogId, toast, setUploading);
    refetch();
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
