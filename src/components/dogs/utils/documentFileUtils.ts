
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/utils/imageOptimization';

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
 * Upload a file to Supabase storage and return the public URL
 */
export const uploadFile = async (
  file: File,
  bucketName: string,
  folder: string,
  compressIfImage: boolean = true
): Promise<string> => {
  try {
    const originalSize = file.size;
    let fileToUpload = file;
    
    // If it's an image and compression is requested, compress it
    if (compressIfImage && file.type.startsWith('image/')) {
      fileToUpload = await compressImage(file);
      console.log(`Compressed image from ${formatFileSize(originalSize)} to ${formatFileSize(fileToUpload.size)}`);
    }
    
    // Create unique filename to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileToUpload);
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from Supabase storage
 */
export const deleteFile = async (url: string, bucketName: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucketName) + 1).join('/');
    
    // Delete the file
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
