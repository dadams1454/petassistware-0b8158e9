
import React from 'react';
import { 
  FileText, 
  Download, 
  Trash, 
  Edit, 
  FileImage, 
  FilePdf, 
  FileArchive,
  File
} from 'lucide-react';
import { DogDocument } from '../../types/document';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface DocumentItemProps {
  document: DogDocument;
  onEdit: (document: DogDocument) => void;
  onDelete: (documentId: string) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ 
  document, 
  onEdit,
  onDelete
}) => {
  // Get file extension to determine icon
  const getFileIcon = () => {
    const ext = document.file_name.split('.').pop()?.toLowerCase();
    
    if (!ext) return <File className="h-10 w-10 text-blue-500" />;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <FileImage className="h-10 w-10 text-green-500" />;
    } else if (ext === 'pdf') {
      return <FilePdf className="h-10 w-10 text-red-500" />;
    } else if (['zip', 'rar', '7z'].includes(ext)) {
      return <FileArchive className="h-10 w-10 text-yellow-500" />;
    } else if (['doc', 'docx', 'txt'].includes(ext)) {
      return <FileText className="h-10 w-10 text-blue-500" />;
    } else {
      return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {getFileIcon()}
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{document.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{document.file_name}</p>
            <p className="text-xs text-muted-foreground">
              Added {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
            </p>
          </div>
          
          <div className="flex gap-2 shrink-0">
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
              onClick={() => onEdit(document)}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(document.id)}
              title="Delete"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentItem;
