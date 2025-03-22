
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { DocumentType } from '../../types/document';
import { useToast } from '@/hooks/use-toast';
import DocumentDialogForm from './DocumentDialogForm';

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues, file?: File) => Promise<void>;
  defaultValues?: Partial<FormValues>;
  isEdit?: boolean;
}

// Define the schema with required fields
const formSchema = z.object({
  document_type: z.string().min(1, 'Document type is required'),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  file_url: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

const DocumentDialog: React.FC<DocumentDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave,
  defaultValues,
  isEdit = false
}) => {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  // Create properly typed default values that match the FormValues type exactly
  const formDefaultValues: FormValues = {
    document_type: defaultValues?.document_type ?? 'other',
    title: defaultValues?.title ?? '',
    notes: defaultValues?.notes ?? '',
    file_url: defaultValues?.file_url ?? '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setUploading(true);
      await onSave(values, file || undefined);
      form.reset();
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: 'Error',
        description: 'Failed to save document',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Document' : 'Add Document'}</DialogTitle>
        </DialogHeader>
        
        <DocumentDialogForm 
          form={form}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isEdit={isEdit}
          uploading={uploading}
          file={file}
          setFile={setFile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
