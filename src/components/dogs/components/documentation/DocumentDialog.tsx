import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageIcon } from 'lucide-react';
import { addDogDocument } from '@/services/dogs/dogDocumentsService';
import { useAuth } from '@/contexts/AuthProvider';
import { DocumentType } from '@/types/dog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUpload from '@/components/ui/FileUpload';

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

interface FormValues {
  document_type: string;
  title: string;
  notes: string;
  file_url: string;
}

const formDefaultValues: FormValues = {
  document_type: '',
  title: '',
  notes: '',
  file_url: ''
};

interface DocumentDialogProps {
  dogId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onDocumentAdded: () => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({ dogId, open, setOpen, onDocumentAdded }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      await addDogDocument({
        dog_id: dogId,
        document_type: values.document_type,
        title: values.title,
        notes: values.notes,
        file_url: values.file_url,
      }, user?.id || '');

      toast({
        title: "Success!",
        description: "Document added successfully.",
      });
      form.reset();
      setOpen(false);
      onDocumentAdded();
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error adding the document.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [dogId, form, setOpen, toast, user, onDocumentAdded]);

  const handleFileUploaded = (url: string) => {
    form.setValue("file_url", url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Attach relevant documents to the dog.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="document_type">Document Type</Label>
            <Input id="document_type" type="text" placeholder="e.g., Vaccination Record" {...form.register("document_type")} />
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
          <div className="grid gap-2">
            <Label htmlFor="file_url">File URL</Label>
             <FileUpload
                dogId={dogId}
                onFileUploaded={handleFileUploaded}
              />
            <Input id="file_url" type="url" placeholder="https://example.com/document.pdf" {...form.register("file_url")} />
            {form.formState.errors.file_url && (
              <p className="text-sm text-red-500">{form.formState.errors.file_url.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Add Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
