
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDogDocument } from '@/services/dogs/dogDocumentsService';
import { useAuth } from '@/contexts/AuthProvider';
import { DocumentType } from '@/types/dog';
import FileUpload from '@/components/ui/FileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DOCUMENT_TYPE_LABELS } from '../../types/document';

const formSchema = z.object({
  document_type: z.string().min(2, {
    message: "Document type must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  notes: z.string().optional(),
  file_url: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: z.infer<typeof formSchema>, file?: File) => Promise<void>;
  defaultValues?: {
    document_type: string;
    title: string;
    notes: string;
    file_url: string;
  };
  isEdit?: boolean;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  defaultValues = {
    document_type: '',
    title: '',
    notes: '',
    file_url: ''
  },
  isEdit = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      await onSave(values, selectedFile || undefined);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error.",
        description: error.message || "There was an error processing the document.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUploaded = (url: string) => {
    form.setValue("file_url", url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Document' : 'Add Document'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update document information.' : 'Attach relevant documents to the dog.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="document_type">Document Type</Label>
            <Select 
              onValueChange={(value) => form.setValue("document_type", value)}
              defaultValue={form.getValues("document_type")}
            >
              <SelectTrigger id="document_type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.document_type && (
              <p className="text-sm text-red-500">{form.formState.errors.document_type.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Document Title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional notes about the document" className="min-h-[80px]" {...form.register("notes")} />
          </div>
          {!isEdit && (
            <FileUpload
              dogId="temp"
              onFileUploaded={handleFileUploaded}
            />
          )}
          <div className="grid gap-2">
            <Label htmlFor="file_url">File URL</Label>
            <Input id="file_url" type="url" placeholder="https://example.com/document.pdf" {...form.register("file_url")} />
            {form.formState.errors.file_url && (
              <p className="text-sm text-red-500">{form.formState.errors.file_url.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEdit ? "Update Document" : "Add Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
