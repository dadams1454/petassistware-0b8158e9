
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, FileText, Download } from 'lucide-react';
import { DogDocument } from '../../types/document';

interface DocumentViewerProps {
  document: DogDocument | null;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  if (!document) return null;

  // More robust file type detection using the actual file_name property
  const fileExtension = document.file_name.split('.').pop()?.toLowerCase() || '';
  
  // Determine content type based on file extension
  const isPdf = fileExtension === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium truncate flex-1">{document.title}</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.open(document.file_url, '_blank')}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="h-[calc(90vh-8rem)] overflow-auto">
          {isPdf ? (
            <iframe 
              src={document.file_url}
              className="w-full h-full border-0"
              title={document.title}
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <img 
                src={document.file_url} 
                alt={document.title} 
                className="max-w-full max-h-full object-contain p-4"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="mb-6 text-muted-foreground">This document type cannot be previewed directly.</p>
              <Button 
                onClick={() => window.open(document.file_url, '_blank')}
                className="min-w-40"
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
