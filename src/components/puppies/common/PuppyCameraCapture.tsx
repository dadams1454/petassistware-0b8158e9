
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/utils/imageOptimization';
import { cn } from '@/lib/utils';

interface PuppyCameraCaptureProps {
  puppyId: string;
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string;
  className?: string;
  showRemoveButton?: boolean;
}

const PuppyCameraCapture: React.FC<PuppyCameraCaptureProps> = ({
  puppyId,
  onPhotoUploaded,
  currentPhotoUrl,
  className,
  showRemoveButton = false,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Show preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Compress the image before upload (max width 1200px, 85% quality)
      const compressedFile = await compressImage(file, 1200, 0.85);
      
      // Upload to Supabase
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `puppies/${puppyId}/photos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(filePath, compressedFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(filePath);
        
      if (!publicUrlData?.publicUrl) throw new Error('Failed to get public URL');
      
      // Call the callback with the URL
      onPhotoUploaded(publicUrlData.publicUrl);
      
      toast({
        title: "Photo uploaded",
        description: "Your photo has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
      
      // Revert to previous photo if available
      setPreviewUrl(currentPhotoUrl || null);
    } finally {
      setIsUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;
    
    try {
      setIsUploading(true);
      setPreviewUrl(null);
      
      // Call the callback with empty string to remove the photo
      onPhotoUploaded('');
      
      toast({
        title: "Photo removed",
        description: "The photo has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove photo",
        variant: "destructive",
      });
      setPreviewUrl(currentPhotoUrl);
    } finally {
      setIsUploading(false);
    }
  };
  
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Puppy photo" 
            className="w-48 h-48 object-cover rounded-lg"
          />
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          
          {showRemoveButton && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 rounded-full h-8 w-8"
              onClick={handleRemovePhoto}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div 
          className="w-48 h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={openCamera}
        >
          <Camera className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Take a photo</p>
        </div>
      )}
      
      <div className="mt-3 flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={openCamera}
          disabled={isUploading}
          className="flex items-center"
        >
          <Camera className="h-4 w-4 mr-2" />
          {previewUrl ? 'Replace' : 'Camera'}
        </Button>
        
        <Button
          type="button"
          variant="outline" 
          size="sm"
          onClick={openCamera}
          disabled={isUploading}
          className="flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default PuppyCameraCapture;
