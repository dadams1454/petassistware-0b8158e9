
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/utils/imageOptimization';
import { UseFormReturn } from 'react-hook-form';

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Handle file upload with compression and validation
 */
export const handlePhotoUpload = async (
  file: File,
  form: UseFormReturn<any>,
  fieldName: string,
  toastFunction: (args: any) => void,
  setUploading: (uploading: boolean) => void,
  setFileSize: (size: string | null) => void
): Promise<string | null> => {
  try {
    const originalSize = file.size;
    setFileSize(formatFileSize(originalSize));

    // Validate file size before compression (max 20 MB)
    if (originalSize > 20 * 1024 * 1024) {
      toastFunction({
        title: 'File too large',
        description: 'Maximum file size is 20MB before compression',
        variant: 'destructive',
      });
      return null;
    }

    setUploading(true);
    
    // Show toast for large files
    if (originalSize > 5 * 1024 * 1024) {
      toastFunction({
        title: 'Compressing image...',
        description: 'Large image detected. Compressing to optimize file size.',
      });
    }
    
    // Apply compression with progressive settings based on file size
    let compressedFile: File;
    
    if (originalSize > 10 * 1024 * 1024) {
      // Very large file - aggressive compression
      compressedFile = await compressImage(file, 1200, 0.6, 0.5);
    } else if (originalSize > 5 * 1024 * 1024) {
      // Large file - medium compression
      compressedFile = await compressImage(file, 1600, 0.7, 0.8);
    } else {
      // Normal file - standard compression
      compressedFile = await compressImage(file, 1920, 0.85, 1);
    }
    
    // Show compression result
    const compressionRatio = (1 - (compressedFile.size / originalSize)) * 100;
    if (compressionRatio > 10) {
      toastFunction({
        title: 'Image compressed',
        description: `Reduced by ${compressionRatio.toFixed(0)}% (${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)})`,
      });
    }
    
    // Generate a unique file name
    const fileName = `${Date.now()}_${file.name}`;
    
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
    form.setValue(fieldName, publicUrl);

    toastFunction({
      title: 'Image uploaded',
      description: 'The image has been optimized and uploaded successfully',
    });
    
    return publicUrl;
  } catch (error: any) {
    toastFunction({
      title: 'Upload failed',
      description: error.message || 'Failed to upload image',
      variant: 'destructive',
    });
    console.error('Error uploading file:', error);
    return null;
  } finally {
    setUploading(false);
  }
};
