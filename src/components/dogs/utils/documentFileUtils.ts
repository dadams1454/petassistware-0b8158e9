
import { toast } from '@/hooks/use-toast';
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

export const processDocumentFile = async (file: File): Promise<File> => {
  const isImage = file.type.startsWith('image/');
  
  // For images, apply compression
  if (isImage) {
    const originalSize = file.size;
    let compressedFile: File;
    
    if (originalSize > 5 * 1024 * 1024) {
      toast({
        title: 'Large image detected',
        description: 'Applying compression to reduce file size...',
      });
      compressedFile = await compressImage(file, 1200, 0.6, 0.6);
    } else if (originalSize > 2 * 1024 * 1024) {
      compressedFile = await compressImage(file, 1600, 0.75, 0.8);
    } else {
      compressedFile = await compressImage(file, 1920, 0.85, 1);
    }
    
    const compressionRatio = (1 - (compressedFile.size / originalSize)) * 100;
    if (compressionRatio > 10) {
      toast({
        title: 'Image compressed',
        description: `Reduced by ${compressionRatio.toFixed(0)}% (${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)})`,
      });
    }
    
    return compressedFile;
  }
  
  return file;
};
