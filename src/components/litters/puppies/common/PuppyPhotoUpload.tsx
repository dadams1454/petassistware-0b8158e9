
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/imageOptimization';
import PuppyPhoto from './PuppyPhoto';
import { formatFileSize } from '@/components/dogs/utils/documentFileUtils';

interface PuppyPhotoUploadProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  litterId: string;
}

const PuppyPhotoUpload = ({ form, name, label, litterId }: PuppyPhotoUploadProps) => {
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
      
      // Compress the image before upload
      const compressedFile = await compressImage(file, 1200, 0.85, 1);
      
      // Generate a unique file name
      const fileName = `puppy_${litterId}_${Date.now()}_${file.name}`;
      
      // Upload compressed file to Supabase storage
      const { data, error } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, compressedFile);

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
        title: 'Photo uploaded',
        description: 'The puppy photo has been optimized and uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload puppy photo',
        variant: 'destructive',
      });
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    form.setValue(name, null);
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
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-32 h-32 rounded-md overflow-hidden border shadow">
                    <img 
                      src={filePreview} 
                      alt="Puppy photo" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                    onClick={clearImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 w-full cursor-pointer"
                  onClick={() => document.getElementById(`${field.name}-upload`)?.click()}
                >
                  <div className="space-y-2 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <div className="text-xs text-gray-500">
                      Click to upload
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
                  className="w-full text-xs h-8"
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

export default PuppyPhotoUpload;
