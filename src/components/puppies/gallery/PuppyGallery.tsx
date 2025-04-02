
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Loader2, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PuppyCameraCapture from '@/components/puppies/common/PuppyCameraCapture';

interface PuppyGalleryProps {
  puppyId: string;
  mainPhotoUrl?: string;
  onMainPhotoChange?: (url: string) => void;
}

interface PuppyPhoto {
  id: string;
  puppy_id: string;
  photo_url: string;
  created_at: string;
  is_main?: boolean;
}

const PuppyGallery: React.FC<PuppyGalleryProps> = ({ 
  puppyId, 
  mainPhotoUrl,
  onMainPhotoChange 
}) => {
  const { toast } = useToast();
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  
  // Fetch all photos for this puppy
  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ['puppyPhotos', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppy_photos')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as PuppyPhoto[];
    }
  });
  
  // Add a new photo
  const addPhotoMutation = useMutation({
    mutationFn: async (photoUrl: string) => {
      const { data, error } = await supabase
        .from('puppy_photos')
        .insert({
          puppy_id: puppyId,
          photo_url: photoUrl,
          is_main: !mainPhotoUrl && (!photos || photos.length === 0)
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      setIsAddingPhoto(false);
    }
  });
  
  // Set a photo as the main profile photo
  const setMainPhotoMutation = useMutation({
    mutationFn: async (photoUrl: string) => {
      // Update the puppy record with the new main photo
      const { error } = await supabase
        .from('puppies')
        .update({ photo_url: photoUrl })
        .eq('id', puppyId);
        
      if (error) throw error;
      
      if (onMainPhotoChange) {
        onMainPhotoChange(photoUrl);
      }
      
      return photoUrl;
    },
    onSuccess: (photoUrl) => {
      toast({
        title: "Profile photo updated",
        description: "The main profile photo has been updated"
      });
    }
  });
  
  // Delete a photo
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const { error } = await supabase
        .from('puppy_photos')
        .delete()
        .eq('id', photoId);
        
      if (error) throw error;
      return photoId;
    },
    onSuccess: () => {
      refetch();
    }
  });
  
  const handleNewPhoto = (url: string) => {
    if (url) {
      addPhotoMutation.mutate(url);
    }
  };
  
  const handleSetMainPhoto = (url: string) => {
    setMainPhotoMutation.mutate(url);
  };
  
  const handleDeletePhoto = (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      deletePhotoMutation.mutate(photoId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Photos</h3>
        <Button 
          size="sm" 
          onClick={() => setIsAddingPhoto(!isAddingPhoto)}
          variant={isAddingPhoto ? "outline" : "default"}
        >
          {isAddingPhoto ? (
            <>Cancel</>
          ) : (
            <><Plus className="h-4 w-4 mr-2" /> Add Photo</>
          )}
        </Button>
      </div>
      
      {isAddingPhoto && (
        <Card>
          <CardContent className="pt-6">
            <PuppyCameraCapture
              puppyId={puppyId}
              onPhotoUploaded={handleNewPhoto}
              className="mb-4"
            />
          </CardContent>
        </Card>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos?.map(photo => (
            <div key={photo.id} className="relative group">
              <img 
                src={photo.photo_url} 
                alt="Puppy photo" 
                className={`aspect-square object-cover rounded-md w-full h-full
                  ${photo.photo_url === mainPhotoUrl ? 'ring-2 ring-primary' : ''}
                `}
              />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-1">
                  {photo.photo_url !== mainPhotoUrl && (
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleSetMainPhoto(photo.photo_url)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button 
                    size="icon" 
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {photo.photo_url === mainPhotoUrl && (
                <div className="absolute top-1 right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
          
          {photos?.length === 0 && !isAddingPhoto && (
            <div className="col-span-full flex flex-col items-center justify-center py-8 bg-muted/20 rounded-md">
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No photos yet</p>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => setIsAddingPhoto(true)}
              >
                Add the first photo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PuppyGallery;
