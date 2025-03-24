
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/imageOptimization';

export const useDogPhotos = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    data: photos, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dogPhotos', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('dog_photos')
        .select('*')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching dog photos:', error);
        toast({
          title: 'Failed to load photos',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!dogId,
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      // Compress image before uploading
      const compressedFile = await compressImage(file);
      
      // Generate a unique file name
      const fileName = `${dogId}_${Date.now()}_${file.name}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dogs')
        .upload(`dog_photos/${fileName}`, compressedFile);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dogs')
        .getPublicUrl(`dog_photos/${fileName}`);
      
      // Save photo record in the database
      const { data, error } = await supabase
        .from('dog_photos')
        .insert({
          dog_id: dogId,
          url: publicUrl,
        })
        .select();
      
      if (error) throw error;
      
      return data![0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogPhotos', dogId] });
      toast({
        title: 'Photo uploaded',
        description: 'The photo has been successfully uploaded',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to upload photo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deletePhoto = useMutation({
    mutationFn: async (photoId: string) => {
      // Get the photo record first to get the URL
      const { data: photoData, error: fetchError } = await supabase
        .from('dog_photos')
        .select('url')
        .eq('id', photoId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Extract the file path from the URL
      const url = photoData.url;
      const filePath = url.split('/').pop();
      
      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('dogs')
          .remove([`dog_photos/${filePath}`]);
        
        if (storageError) console.error('Error deleting file from storage:', storageError);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('dog_photos')
        .delete()
        .eq('id', photoId);
      
      if (error) throw error;
      
      return photoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogPhotos', dogId] });
      toast({
        title: 'Photo deleted',
        description: 'The photo has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete photo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const setProfilePhoto = useMutation({
    mutationFn: async (photoUrl: string) => {
      const { error } = await supabase
        .from('dogs')
        .update({ photo_url: photoUrl })
        .eq('id', dogId);
      
      if (error) throw error;
      
      return photoUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog', dogId] });
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast({
        title: 'Profile photo updated',
        description: 'The profile photo has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update profile photo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    photos,
    isLoading,
    error,
    refetch,
    uploadPhoto,
    deletePhoto,
    setProfilePhoto,
  };
};
