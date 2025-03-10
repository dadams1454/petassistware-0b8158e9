
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import VariableHelp from './VariableHelp';

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  type: z.enum(["email", "sms"]),
  subject: z.string().optional(),
  content: z.string().min(1, "Content is required")
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateDialogProps {
  template?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({
  template,
  open,
  onOpenChange,
  onSuccess
}) => {
  const isEditing = !!template;
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || '',
      type: template?.type || 'email',
      subject: template?.subject || '',
      content: template?.content || ''
    }
  });

  const { watch } = form;
  const currentType = watch('type');

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('communication_templates')
          .update({
            ...values,
            updated_at: new Date().toISOString()
          })
          .eq('id', template.id);
        
        if (error) throw error;
        
        toast({
          title: "Template updated",
          description: "Your communication template has been updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('communication_templates')
          .insert([values]);
        
        if (error) throw error;
        
        toast({
          title: "Template created",
          description: "Your new communication template has been created successfully."
        });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Template' : 'Create Template'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Puppy Update" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type*</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {currentType === 'email' && (
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Line</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Update on your puppy" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Content*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={currentType === 'email' 
                            ? "Dear {{customer_name}},\n\nWe wanted to share an update about your puppy, {{puppy_name}}..." 
                            : "Bear Paw Kennels: {{puppy_name}} update - {{custom_message}}"
                          } 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <VariableHelp />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Template' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
