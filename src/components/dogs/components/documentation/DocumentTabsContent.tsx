
import React from 'react';
import { CircleHelp } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import DocumentItem from './DocumentItem';
import { DogDocument } from '../../types/document';

interface DocumentTabsContentProps {
  documents: DogDocument[];
  value: string;
  label: string;
  onEdit: (document: DogDocument) => void;
  onDelete: (documentId: string) => void;
  onView: (document: DogDocument) => void;
}

const DocumentTabsContent: React.FC<DocumentTabsContentProps> = ({
  documents,
  value,
  label,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <TabsContent key={value} value={value} className="space-y-4">
      {documents?.length ? (
        documents.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <CircleHelp className="h-8 w-8 mx-auto mb-2" />
          No {label} documents available
        </div>
      )}
    </TabsContent>
  );
};

export default DocumentTabsContent;
