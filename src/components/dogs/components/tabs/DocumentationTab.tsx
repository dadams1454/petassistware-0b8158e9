
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDogDocuments } from '../../hooks/useDogDocuments';
import DocumentDialog from '../documentation/DocumentDialog';
import DogBasicInfo from '../documentation/DogBasicInfo';
import DocumentList from '../documentation/DocumentList';

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
      
      {/* Document list section - now as a separate component */}
      <DocumentList 
        documents={documents}
        isLoading={isLoading}
        onEdit={openEditDocument}
        onDelete={handleDeleteDocument}
        onAddDocument={openAddDocument}
      />
      
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
