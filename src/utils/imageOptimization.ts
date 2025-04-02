
/**
 * Compresses an image file to reduce size while maintaining quality
 * 
 * @param file The image file to compress
 * @param maxWidth Maximum width in pixels (default: 1200)
 * @param quality Compression quality from 0 to 1 (default: 0.85)
 * @param maxSizeRatio Maximum file size ratio compared to original (default: 1)
 * @returns Promise that resolves to the compressed file
 */
export const compressImage = async (
  file: File,
  maxWidth = 1200,
  quality = 0.85,
  maxSizeRatio = 1
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Create canvas and context
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not create blob'));
            return;
          }
          
          // Create new file
          const compressedFile = new File(
            [blob],
            file.name,
            {
              type: 'image/jpeg',
              lastModified: Date.now()
            }
          );
          
          // If the compressed file is larger than the target size, just return the original
          if (compressedFile.size > file.size * maxSizeRatio) {
            resolve(file);
          } else {
            resolve(compressedFile);
          }
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};
