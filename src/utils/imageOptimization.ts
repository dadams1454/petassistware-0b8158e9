
/**
 * Utility for optimizing images before upload
 */

/**
 * Compresses an image file to reduce file size
 * @param file Original image file
 * @param maxWidth Maximum width for the compressed image
 * @param quality JPEG quality (0-1)
 * @param scale Scale factor for the image (0-1)
 * @returns A Promise that resolves to the compressed File
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8,
  scale: number = 1.0
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        let width = img.width * scale;
        let height = img.height * scale;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }
            
            // Create new file from blob
            const compressedFile = new File(
              [blob],
              file.name,
              {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }
            );
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

/**
 * Generates a thumbnail from a file
 * @param file Original image file
 * @param size Size of the thumbnail (width and height)
 * @returns A Promise that resolves to the thumbnail File
 */
export const generateThumbnail = async (
  file: File,
  size: number = 200
): Promise<File> => {
  return compressImage(file, size, 0.7, 1.0);
};
