
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, Plus, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PuppyPhotoGalleryProps {
  puppy: Puppy;
}

const PuppyPhotoGallery: React.FC<PuppyPhotoGalleryProps> = ({ puppy }) => {
  const [photos, setPhotos] = useState<string[]>([
    // Demo data - in a real app, these would come from the database
    puppy.photo_url || '',
    // Add more sample images if needed
  ].filter(Boolean));
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setIsUploading(true);
      
      // Generate a unique file name
      const fileName = `puppy_${puppy.id}_${Date.now()}_${file.name}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName);

      // Update the photos array
      setPhotos([...photos, publicUrl]);

      toast({
        title: 'Image uploaded',
        description: 'The image has been uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    
    // In a real app, this would also delete from storage
    toast({
      title: 'Photo removed',
      description: 'The photo has been removed from the gallery',
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="h-5 w-5" />
              Photo Gallery
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="h-8"
              disabled={isUploading}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isUploading ? 'Uploading...' : 'Add Photo'}
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </CardHeader>
        <CardContent>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <AspectRatio ratio={1}>
                    <img
                      src={photo}
                      alt={`Puppy photo ${index + 1}`}
                      className="rounded-md object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                  </AspectRatio>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No photos available.</p>
              <p className="text-sm">Add photos to create a gallery for this puppy.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative w-full">
              <AspectRatio ratio={4/3}>
                <img
                  src={selectedPhoto}
                  alt="Puppy photo"
                  className="rounded-md object-contain w-full h-full"
                />
              </AspectRatio>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PuppyPhotoGallery;
