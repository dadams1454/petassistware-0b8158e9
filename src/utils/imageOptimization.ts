
/**
 * Compresses an image file to reduce its size while maintaining reasonable quality
 * @param file The original image file
 * @param maxWidth Maximum width for the compressed image (default: 1920px)
 * @param quality JPEG quality factor (0-1, default: 0.85)
 * @param scale Scale factor for other image types (0-1, default: 1)
 * @returns A Promise resolving to the compressed File
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.85,
  scale: number = 1
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Don't compress if it's not an image or already small
    if (!file.type.startsWith('image/') || file.size < 50 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Determine if we need to resize based on width
        const needsResize = img.width > maxWidth;
        const width = needsResize ? maxWidth : img.width;
        const height = needsResize ? img.height * (maxWidth / img.width) : img.height;
        
        // Create canvas for the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use different compression types based on the image format
        let dataUrl: string;
        let type = file.type;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        } else if (file.type === 'image/png') {
          dataUrl = canvas.toDataURL('image/png', scale);
        } else {
          // For other formats, use their original type
          dataUrl = canvas.toDataURL(type, quality);
        }
        
        // Convert data URL to Blob
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        
        // Create new File
        const newFile = new File([blob], file.name, { type: mimeString });
        resolve(newFile);
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
