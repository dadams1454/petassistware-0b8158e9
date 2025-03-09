
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

const PhotoUpload = ({ form, name, label }: PhotoUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Get the current photo URL from the form
  const currentPhotoUrl = form.watch(name);

  // Set the preview when the component mounts or the URL changes
  useEffect(() => {
    if (currentPhotoUrl) {
      setFilePreview(currentPhotoUrl);
    }
  }, [currentPhotoUrl]);

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

      // Create a temporary file preview
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);

      setUploading(true);
      
      // Generate a unique file name
      const fileName = `${Date.now()}_${file.name}`;
      
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

      // Update the form with the public URL
      form.setValue(name, publicUrl);

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
      setUploading(false);
    }
  };

  const clearImage = () => {
    form.setValue(name, '');
    setFilePreview(null);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {filePreview ? (
                <div className="relative w-40 h-40 mx-auto">
                  <Avatar className="w-40 h-40 border rounded-md shadow">
                    <AvatarImage src={filePreview} alt="Dog photo" className="object-cover" />
                    <AvatarFallback className="text-xl">Dog</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 rounded-full w-7 h-7"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-40 w-full cursor-pointer"
                  onClick={() => document.getElementById(`${field.name}-upload`)?.click()}>
                  <div className="space-y-2 text-center">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                    <div className="text-sm text-gray-500">
                      Click to upload a photo
                    </div>
                    <div className="text-xs text-gray-400">
                      (Max size: 5MB)
                    </div>
                  </div>
                </div>
              )}
              <input
                id={`${field.name}-upload`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {!filePreview && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploading}
                  onClick={() => document.getElementById(`${field.name}-upload`)?.click()}
                >
                  {uploading ? 'Uploading...' : 'Select image'}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhotoUpload;
