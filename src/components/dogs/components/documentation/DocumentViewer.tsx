
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DogDocument } from '../../types/document';

interface DocumentViewerProps {
  document: DogDocument | null;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  if (!document) return null;

  // Determine if we need an iframe (for PDFs) or an img (for images)
  const isPdf = document.file_name.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(document.file_name);

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium truncate">{document.title}</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-[calc(90vh-8rem)] overflow-auto">
          {isPdf ? (
            <iframe 
              src={`${document.file_url}#toolbar=0`}
              className="w-full h-full"
              title={document.title}
              onClick={(e) => e.stopPropagation()}
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <img 
                src={document.file_url} 
                alt={document.title} 
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="mb-4">This document type cannot be previewed directly.</p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(document.file_url, '_blank');
                }}
              >
                Open in New Tab
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
