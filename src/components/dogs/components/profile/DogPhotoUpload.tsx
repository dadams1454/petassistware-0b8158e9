
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PhotoPreview from './photo/PhotoPreview';
import UploadButton from './photo/UploadButton';
import PhotoActionButtons from './photo/PhotoActionButtons';
import { usePhotoUpload } from './photo/usePhotoUpload';

interface DogPhotoUploadProps {
  dogId: string;
  currentPhoto?: string;
  onClose: () => void;
}

const DogPhotoUpload: React.FC<DogPhotoUploadProps> = ({ 
  dogId, 
  currentPhoto, 
  onClose 
}) => {
  const {
    selectedFile,
    previewUrl,
    isUploading,
    handleFileChange,
    clearSelectedFile,
    handleUpload,
    handleRemove
  } = usePhotoUpload(dogId, currentPhoto, onClose);
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Dog Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {(previewUrl || currentPhoto) && (
            <PhotoPreview 
              imageUrl={previewUrl || currentPhoto || ''} 
              onClear={previewUrl ? clearSelectedFile : undefined}
              isEditable={!!previewUrl}
            />
          )}
          
          <UploadButton onFileSelect={handleFileChange} />
        </div>
        
        <PhotoActionButtons 
          onRemove={handleRemove}
          onSave={handleUpload}
          onCancel={onClose}
          isUploading={isUploading}
          canRemove={!!(currentPhoto || previewUrl)}
          canSave={!!selectedFile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DogPhotoUpload;
