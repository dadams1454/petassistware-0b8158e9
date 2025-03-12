
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DocumentType, DOCUMENT_TYPE_LABELS } from '../../types/document';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { compressImage } from '@/utils/imageOptimization';
import { useToast } from '@/hooks/use-toast';

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues, file?: File) => Promise<void>;
  defaultValues?: Partial<FormValues>;
  isEdit?: boolean;
}

const formSchema = z.object({
  document_type: z.string(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      document_type: 'other',
      title: '',
      notes: '',
      file_url: '',
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    const fileSize = selectedFile.size / 1024 / 1024;
    
    if (fileSize > 10) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive',
      });
      return;
    }
    
    // Only compress images
    if (selectedFile.type.startsWith('image/')) {
      try {
        const compressedFile = await compressImage(selectedFile, 1920, 0.8, 1);
        setFile(compressedFile);
      } catch (error) {
        console.error('Error compressing file:', error);
        setFile(selectedFile); // Use original file if compression fails
      }
    } else {
      setFile(selectedFile);
    }
  };

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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="document_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Document title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes here..." 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!isEdit && (
              <div className="space-y-2">
                <FormLabel>File</FormLabel>
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading || (!isEdit && !file)}>
                {uploading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
