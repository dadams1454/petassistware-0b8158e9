
import React from 'react';
import { 
  FileText, 
  Download, 
  Trash, 
  Edit, 
  FileImage, 
  File,
  Archive,
  FileSpreadsheet,
  FilePdf
} from 'lucide-react';
import { DogDocument } from '../../types/document';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DOCUMENT_TYPE_LABELS } from '../../types/document';

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
      return <Archive className="h-10 w-10 text-yellow-500" />;
    } else if (['doc', 'docx'].includes(ext)) {
      return <FileText className="h-10 w-10 text-blue-500" />;
    } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return <FileSpreadsheet className="h-10 w-10 text-green-700" />;
    } else {
      return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  // Format file creation date
  const getFormattedDate = () => {
    try {
      const date = new Date(document.created_at);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Date unknown';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {getFileIcon()}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{document.title}</h4>
              <Badge variant="outline" className="text-xs">
                {DOCUMENT_TYPE_LABELS[document.document_type] || 'Other'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{document.file_name}</p>
            <p className="text-xs text-muted-foreground">
              Added {getFormattedDate()}
            </p>
            {document.notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {document.notes}
              </p>
            )}
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
