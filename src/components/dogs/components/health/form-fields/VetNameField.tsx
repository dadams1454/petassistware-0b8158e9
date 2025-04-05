
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface VetNameFieldProps {
  disabled?: boolean;
  form?: any; // Added for compatibility with different form implementations
}

const VetNameField = ({ disabled = false, form: externalForm }: VetNameFieldProps) => {
  const internalForm = useFormContext();
  const form = externalForm || internalForm;

  return (
    <FormField
      control={form.control}
      name="vet_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Veterinarian</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter veterinarian name"
              disabled={disabled}
              {...field}
              value={field.value || ''}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default VetNameField;
