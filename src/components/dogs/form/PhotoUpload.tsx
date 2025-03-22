
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FilePreview from './components/FilePreview';
import UploadPlaceholder from './components/UploadPlaceholder';
import { handlePhotoUpload } from './utils/fileUploadUtils';

interface PhotoUploadProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

const PhotoUpload = ({ form, name, label }: PhotoUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  // Get the current photo URL from the form
  const currentPhotoUrl = form.watch(name);

  // Set the preview when the component mounts or the URL changes
  useEffect(() => {
    if (currentPhotoUrl) {
      setFilePreview(currentPhotoUrl);
    }
  }, [currentPhotoUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    
    // Create a temporary file preview
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    
    // Process and upload the file
    await handlePhotoUpload(file, form, name, toast, setUploading, setFileSize);
  };

  const clearImage = () => {
    form.setValue(name, '');
    setFilePreview(null);
    setFileSize(null);
  };

  const handleUploadClick = () => {
    document.getElementById(`${name}-upload`)?.click();
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
                <FilePreview 
                  filePreview={filePreview}
                  fileSize={fileSize}
                  onClear={clearImage}
                />
              ) : (
                <UploadPlaceholder onClick={handleUploadClick} />
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
                  onClick={handleUploadClick}
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
