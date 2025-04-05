
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Paperclip } from 'lucide-react';

interface DocumentUrlFieldProps {
  disabled?: boolean;
}

const DocumentUrlField = ({ disabled = false }: DocumentUrlFieldProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="document_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Document URL</FormLabel>
          <FormControl>
            <div className="flex items-center border rounded-md overflow-hidden">
              <div className="bg-muted px-3 py-2 flex items-center">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input 
                placeholder="Enter document URL or upload file"
                disabled={disabled}
                {...field}
                value={field.value || ''}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </FormControl>
          <FormDescription>
            Enter a URL to the document or upload a file
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default DocumentUrlField;
