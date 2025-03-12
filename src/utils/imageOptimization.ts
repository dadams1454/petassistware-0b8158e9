
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
    // For very small files, skip compression
    if (file.size / 1024 / 1024 < maxSizeInMB / 2) {
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
        
        // Use appropriate format based on original file
        const mimeType = ['png', 'gif'].includes(extension) ? 'image/png' : 'image/jpeg';
        
        // Convert to blob with appropriate compression
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
            
            // Check if we need to compress again with more aggressive settings
            if (newFile.size / 1024 / 1024 > maxSizeInMB) {
              console.log('File still too large, applying more aggressive compression');
              
              // Create another canvas with smaller dimensions
              const secondCanvas = document.createElement('canvas');
              const secondCtx = secondCanvas.getContext('2d');
              
              if (!secondCtx) {
                reject(new Error('Could not get canvas context for second compression'));
                return;
              }
              
              // Reduce dimensions further
              const newWidth = Math.min(800, width * 0.8);
              const scaleRatio = newWidth / width;
              const newHeight = height * scaleRatio;
              
              secondCanvas.width = newWidth;
              secondCanvas.height = newHeight;
              
              // Draw with reduced dimensions
              secondCtx.drawImage(img, 0, 0, newWidth, newHeight);
              
              // Apply more aggressive compression
              secondCanvas.toBlob(
                (secondBlob) => {
                  if (!secondBlob) {
                    reject(new Error('Could not apply second compression'));
                    return;
                  }
                  
                  const finalFile = new File(
                    [secondBlob], 
                    file.name, 
                    { 
                      type: mimeType,
                      lastModified: Date.now() 
                    }
                  );
                  
                  console.log(`Second compression: ${(newFile.size / 1024 / 1024).toFixed(2)}MB to ${(finalFile.size / 1024 / 1024).toFixed(2)}MB`);
                  resolve(finalFile);
                },
                mimeType,
                // Even more aggressive quality reduction on second pass
                mimeType === 'image/jpeg' ? Math.min(quality * 0.7, 0.5) : undefined
              );
            } else {
              resolve(newFile);
            }
          },
          mimeType,
          mimeType === 'image/jpeg' ? quality : undefined
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

/**
 * Converts a file to a zip archive to reduce its size
 * @param file The file to compress
 * @param zipFileName Name for the zip file
 * @returns Promise resolving to a zipped File object
 */
export const zipFile = async (file: File, zipFileName?: string): Promise<File> => {
  // Simply return the original file for now as client-side zipping requires additional libraries
  // This is a placeholder for future implementation
  console.warn('Client-side zip compression not implemented yet');
  return file;
  
  // Implementation would require a library like JSZip:
  // const zip = new JSZip();
  // zip.file(file.name, file);
  // const content = await zip.generateAsync({ type: "blob" });
  // return new File([content], zipFileName || `${file.name}.zip`, { type: "application/zip" });
};
