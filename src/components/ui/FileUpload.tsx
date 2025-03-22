
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/imageOptimization';

interface FileUploadProps {
  dogId: string;
  onFileUploaded: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ dogId, onFileUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Process image files (compress them)
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(file, 1920, 0.8, 1);
        } catch (error) {
          console.error('Error compressing image:', error);
          // Continue with original file if compression fails
        }
      }

      // Create a unique filename
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${dogId}/${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload file to Supabase Storage
      const { error, data } = await supabase.storage
        .from('dog_files')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          },
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dog_files')
        .getPublicUrl(filePath);

      onFileUploaded(publicUrl);
      toast({
        title: 'File uploaded successfully',
        description: 'Your file has been uploaded and attached to the document.',
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'There was a problem uploading your file.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        className="relative overflow-hidden"
        asChild
      >
        <label>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? `Uploading (${uploadProgress}%)` : 'Upload File'}
        </label>
      </Button>
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
