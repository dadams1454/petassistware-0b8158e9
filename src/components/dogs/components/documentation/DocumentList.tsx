
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogDocument, DOCUMENT_TYPE_LABELS } from '../../types/document';
import DocumentItem from './DocumentItem';
import EmptyDocumentState from './EmptyDocumentState';
import DocumentTabsContent from './DocumentTabsContent';

interface DocumentListProps {
  documents: DogDocument[] | undefined;
  isLoading: boolean;
  onEdit: (document: DogDocument) => void;
  onDelete: (documentId: string) => void;
  onAddDocument: () => void;
  onView: (document: DogDocument) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  onEdit,
  onDelete,
  onAddDocument,
  onView
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!documents?.length) {
    return <EmptyDocumentState onAddDocument={onAddDocument} />;
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4 flex flex-wrap h-auto">
        <TabsTrigger value="all">All</TabsTrigger>
        {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
          <TabsTrigger 
            key={value} 
            value={value}
            disabled={!documents?.filter(d => d.document_type === value).length}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        {documents?.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </TabsContent>
      
      {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
        <DocumentTabsContent
          key={value}
          value={value}
          label={label}
          documents={documents?.filter(d => d.document_type === value) || []}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </Tabs>
  );
};

export default DocumentList;
