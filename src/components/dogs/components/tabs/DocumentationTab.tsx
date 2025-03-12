import React from 'react';
import { 
  FileText, 
  Plus, 
  File, 
  FileBadge, 
  FileHeart, 
  CircleHelp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDogDocuments } from '../../hooks/useDogDocuments';
import DocumentItem from '../documentation/DocumentItem';
import DocumentDialog from '../documentation/DocumentDialog';
import { DOCUMENT_TYPE_LABELS, DocumentType } from '../../types/document';

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

  // Group documents by type
  const groupedDocuments = React.useMemo(() => {
    if (!documents) return {};
    
    const grouped: Record<DocumentType, typeof documents> = {
      registration_certificate: [],
      health_certificate: [],
      microchip_registration: [],
      pedigree: [],
      dna_test: [],
      purchase_agreement: [],
      vaccination_record: [],
      other: []
    };
    
    documents.forEach((doc) => {
      if (doc.document_type in grouped) {
        grouped[doc.document_type as DocumentType].push(doc);
      } else {
        grouped.other.push(doc);
      }
    });
    
    return grouped;
  }, [documents]);

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
      
      {/* Basic information section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dog.microchip_number && (
          <div className="flex items-center gap-2">
            <FileBadge className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground font-medium">Microchip:</span>{' '}
              {dog.microchip_number}
            </div>
          </div>
        )}
        
        {dog.registration_number && (
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground font-medium">Registration Number:</span>{' '}
              {dog.registration_number}
            </div>
          </div>
        )}
        
        {dog.pedigree && (
          <div className="flex items-center gap-2">
            <FileHeart className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground font-medium">Pedigree:</span>{' '}
              Yes
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Document list section */}
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : documents?.length === 0 ? (
        <div className="text-center py-8">
          <File className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Documents Yet</h3>
          <p className="text-muted-foreground">
            Upload important documents like registration certificates, health records, and more.
          </p>
          <Button onClick={openAddDocument} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
              <TabsTrigger 
                key={value} 
                value={value}
                disabled={!groupedDocuments[value as DocumentType]?.length}
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
            <TabsContent key={value} value={value} className="space-y-4">
              {groupedDocuments[value as DocumentType]?.length ? (
                groupedDocuments[value as DocumentType].map((document) => (
                  <DocumentItem
                    key={document.id}
                    document={document}
                    onEdit={openEditDocument}
                    onDelete={handleDeleteDocument}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CircleHelp className="h-8 w-8 mx-auto mb-2" />
                  No {label} documents available
                </div>
              )}
            </TabsContent>
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
