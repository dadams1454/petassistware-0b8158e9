
/**
 * Utility functions for image optimization and compression
 */

/**
 * Compresses an image file while maintaining visual quality
 * @param file The original image file to compress
 * @param maxWidth Maximum width in pixels (original width is used if smaller)
 * @param quality JPEG quality (0.0 to 1.0), ignored for PNG
 * @param maxSizeInMB Maximum size in MB for the compressed image
 * @returns Promise resolving to a compressed File object
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.85,
  maxSizeInMB: number = 1
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Skip compression for small files already under maxSizeInMB
    if (file.size / 1024 / 1024 < maxSizeInMB) {
      console.log('Image already small enough, skipping compression');
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Determine new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get file extension
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        
        // Use appropriate format
        const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }
            
            // Create new file
            const newFile = new File(
              [blob], 
              file.name, 
              { 
                type: mimeType,
                lastModified: Date.now() 
              }
            );
            
            console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(newFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(newFile);
          },
          mimeType,
          extension === 'png' ? undefined : quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};
