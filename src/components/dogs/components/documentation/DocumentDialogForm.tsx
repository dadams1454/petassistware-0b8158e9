
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { DialogFooter } from '@/components/ui/dialog';
import { DOCUMENT_TYPE_LABELS } from '../../types/document';
import DocumentFileUpload from './DocumentFileUpload';

interface FormValues {
  document_type: string;
  title: string;
  notes?: string;
  file_url?: string;
}

interface DocumentDialogFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isEdit: boolean;
  uploading: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
}

const DocumentDialogForm: React.FC<DocumentDialogFormProps> = ({
  form,
  onSubmit,
  onCancel,
  isEdit,
  uploading,
  file,
  setFile
}) => {
  return (
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
          <DocumentFileUpload 
            file={file}
            setFile={setFile}
            uploading={uploading}
          />
        )}
        
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
  );
};

export default DocumentDialogForm;
