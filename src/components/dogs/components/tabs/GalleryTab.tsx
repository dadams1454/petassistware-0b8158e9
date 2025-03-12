
import React, { useRef } from 'react';
import PhotoGrid from '../gallery/PhotoGrid';
import PhotoViewer from '../gallery/PhotoViewer';
import PhotoUploader from '../gallery/PhotoUploader';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';

interface GalleryTabProps {
  dogId: string;
  mainPhotoUrl?: string;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ dogId, mainPhotoUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    photos,
    isLoading,
    uploading,
    viewLargeImage,
    setViewLargeImage,
    handleFileChange,
    handleDeletePhoto
  } = usePhotoGallery(dogId);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Image upload button */}
      <PhotoUploader 
        uploading={uploading} 
        onUploadClick={handleUploadClick} 
      />
      
      <input
        ref={fileInputRef}
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {/* Gallery grid */}
      <PhotoGrid 
        photos={photos || []}
        mainPhotoUrl={mainPhotoUrl}
        isLoading={isLoading}
        onPhotoClick={setViewLargeImage}
        onDeletePhoto={handleDeletePhoto}
        onUploadClick={handleUploadClick}
      />

      {/* Large image viewer */}
      <PhotoViewer 
        photoUrl={viewLargeImage}
        onClose={() => setViewLargeImage(null)}
      />
    </div>
  );
};

export default GalleryTab;
