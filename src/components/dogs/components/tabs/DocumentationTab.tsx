
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDogDocuments } from '../../hooks/useDogDocuments';
import DocumentItem from '../documentation/DocumentItem';
import DocumentDialog from '../documentation/DocumentDialog';
import { DOCUMENT_TYPE_LABELS } from '../../types/document';
import DogBasicInfo from '../documentation/DogBasicInfo';
import EmptyDocumentState from '../documentation/EmptyDocumentState';
import DocumentTabsContent from '../documentation/DocumentTabsContent';

interface DocumentationTabProps {
  dog: any;
}

const DocumentationTab: React.FC<DocumentationTabProps> = ({ dog }) => {
  const {
    documents,
    isLoading,
    isAddDocumentOpen,
    isEditDocumentOpen,
    documentToEdit,
    openAddDocument,
    closeAddDocument,
    openEditDocument,
    closeEditDocument,
    handleSaveDocument,
    handleUpdateDocument,
    handleDeleteDocument
  } = useDogDocuments(dog.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documentation</h3>
        <Button onClick={openAddDocument}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>
      
      <Separator />
      
      <DogBasicInfo
        microchip_number={dog.microchip_number}
        registration_number={dog.registration_number}
        pedigree={dog.pedigree}
      />
      
      <Separator />
      
      {/* Document list section */}
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : documents?.length === 0 ? (
        <EmptyDocumentState onAddDocument={openAddDocument} />
      ) : (
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
                onEdit={openEditDocument}
                onDelete={handleDeleteDocument}
              />
            ))}
          </TabsContent>
          
          {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
            <DocumentTabsContent
              key={value}
              value={value}
              label={label}
              documents={documents?.filter(d => d.document_type === value) || []}
              onEdit={openEditDocument}
              onDelete={handleDeleteDocument}
            />
          ))}
        </Tabs>
      )}
      
      {/* Document dialogs */}
      <DocumentDialog
        open={isAddDocumentOpen}
        onOpenChange={closeAddDocument}
        onSave={handleSaveDocument}
      />
      
      {documentToEdit && (
        <DocumentDialog
          open={isEditDocumentOpen}
          onOpenChange={closeEditDocument}
          onSave={handleUpdateDocument}
          defaultValues={{
            document_type: documentToEdit.document_type,
            title: documentToEdit.title,
            notes: documentToEdit.notes || '',
            file_url: documentToEdit.file_url,
          }}
          isEdit
        />
      )}
    </div>
  );
};

export default DocumentationTab;
