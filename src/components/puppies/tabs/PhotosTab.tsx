
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PuppyGallery from '@/components/puppies/gallery/PuppyGallery';

interface PhotosTabProps {
  puppyId: string;
  mainPhotoUrl?: string;
  onPhotoChange?: () => void;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ puppyId, mainPhotoUrl, onPhotoChange }) => {
  const { toast } = useToast();
  
  const updateMainPhotoMutation = useMutation({
    mutationFn: async (photoUrl: string) => {
      const { error } = await supabase
        .from('puppies')
        .update({ photo_url: photoUrl })
        .eq('id', puppyId);
        
      if (error) throw error;
      return photoUrl;
    },
    onSuccess: () => {
      toast({
        title: "Profile photo updated",
        description: "The main photo has been updated successfully"
      });
      
      if (onPhotoChange) {
        onPhotoChange();
      }
    }
  });
  
  const handleMainPhotoChange = (url: string) => {
    updateMainPhotoMutation.mutate(url);
  };

  return (
    <div className="space-y-6">
      <PuppyGallery
        puppyId={puppyId}
        mainPhotoUrl={mainPhotoUrl}
        onMainPhotoChange={handleMainPhotoChange}
      />
    </div>
  );
};

export default PhotosTab;
