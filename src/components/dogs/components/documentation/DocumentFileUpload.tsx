
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/imageOptimization';

interface DocumentFileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  uploading: boolean;
}

const DocumentFileUpload: React.FC<DocumentFileUploadProps> = ({ 
  file, 
  setFile, 
  uploading 
}) => {
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    const fileSize = selectedFile.size / 1024 / 1024;
    
    if (fileSize > 10) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive',
      });
      return;
    }
    
    // Only compress images
    if (selectedFile.type.startsWith('image/')) {
      try {
        const compressedFile = await compressImage(selectedFile, 1920, 0.8, 1);
        setFile(compressedFile);
      } catch (error) {
        console.error('Error compressing file:', error);
        setFile(selectedFile); // Use original file if compression fails
      }
    } else {
      setFile(selectedFile);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>File</FormLabel>
      <Input 
        id="file-upload" 
        type="file" 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        disabled={uploading}
      />
      {file && (
        <p className="text-sm text-muted-foreground">
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
};

export default DocumentFileUpload;
