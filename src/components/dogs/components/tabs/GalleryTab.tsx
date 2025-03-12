import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload } from 'lucide-react';
import { compressImage } from '@/utils/imageOptimization';

interface GalleryTabProps {
  dogId: string;
  mainPhotoUrl?: string;
}

interface Photo {
  id: string;
  url: string;
  created_at: string;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ dogId, mainPhotoUrl }) => {
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

  // Combine main photo with gallery photos for display
  const allPhotos = [
    ...(mainPhotoUrl ? [{ id: 'main', url: mainPhotoUrl, created_at: new Date().toISOString() }] : []),
    ...(photos || [])
  ];

  return (
    <div className="space-y-6">
      {/* Image upload button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Dog Photos</h3>
        <Button 
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Add Photo'}
        </Button>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {/* Gallery grid */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : allPhotos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted p-3 rounded-full mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No photos</h3>
            <p className="text-center text-muted-foreground mb-4">
              Add photos to create a gallery for this dog.
            </p>
            <Button 
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              Upload first photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative group aspect-square rounded-md overflow-hidden border"
            >
              <div 
                className="w-full h-full bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${photo.url})` }}
                onClick={() => setViewLargeImage(photo.url)}
              />
              
              {/* Overlay and actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (photo.id !== 'main') {
                      handleDeletePhoto(photo.id);
                    } else {
                      toast({
                        description: "This is the main profile photo. Edit the dog to change it.",
                      });
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Main photo indicator */}
              {photo.id === 'main' && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                  Profile
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Large image viewer */}
      {viewLargeImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewLargeImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Button 
              variant="outline" 
              size="icon"
              className="absolute -top-12 right-0 rounded-full bg-white/20 hover:bg-white/30"
              onClick={() => setViewLargeImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img 
              src={viewLargeImage} 
              alt="Dog" 
              className="max-w-full max-h-[90vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;
