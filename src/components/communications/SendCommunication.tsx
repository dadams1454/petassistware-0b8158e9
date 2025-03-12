
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from '@/components/ui/use-toast';
import { supabase, CommunicationTemplatesRow } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerSelector from './CustomerSelector';
import VariableHelp from './VariableHelp';
import MessagePreview from './MessagePreview';
import SmsCharacterCounter from './SmsCharacterCounter';

const sendSchema = z.object({
  template_id: z.string().optional(),
  customer_id: z.string().min(1, "Please select a customer"),
  puppy_id: z.string().optional(),
  type: z.enum(["email", "sms"]),
  subject: z.string().optional(),
  content: z.string().min(1, "Message content is required"),
  custom_message: z.string().optional()
});

type SendFormValues = z.infer<typeof sendSchema>;

const SendCommunication: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedPuppy, setSelectedPuppy] = useState<any>(null);
  const [puppies, setPuppies] = useState<any[]>([]);
  const [previewContent, setPreviewContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Fetch communication templates
  const { data: templates } = useQuery({
    queryKey: ['communication-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as CommunicationTemplatesRow[];
    }
  });

  const form = useForm<SendFormValues>({
    resolver: zodResolver(sendSchema),
    defaultValues: {
      type: 'email',
      subject: '',
      content: '',
      custom_message: ''
    }
  });

  const { watch, setValue } = form;
  const selectedTemplateId = watch('template_id');
  const selectedType = watch('type');
  const customerId = watch('customer_id');
  const puppyId = watch('puppy_id');
  const content = watch('content');
  const customMessage = watch('custom_message');

  // When template changes, update form fields
  useEffect(() => {
    if (!selectedTemplateId || !templates) return;
    
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    if (selectedTemplate) {
      setValue('type', selectedTemplate.type);
      setValue('subject', selectedTemplate.subject || '');
      setValue('content', selectedTemplate.content);
    }
  }, [selectedTemplateId, templates, setValue]);

  // When customer changes, fetch their puppies
  useEffect(() => {
    if (!customerId) return;
    
    const fetchPuppies = async () => {
      // This is a simplified query, you'd need to adjust based on your schema
      const { data } = await supabase
        .from('puppies')
        .select('*')
        .eq('status', 'Sold');
      
      // Ideally you'd have a relation between customers and puppies
      // This is just a placeholder, you'll need to implement this based on your schema
      setPuppies(data || []);
    };
    
    fetchPuppies();
  }, [customerId]);

  // Generate preview when content or variables change
  useEffect(() => {
    if (!content) return;
    
    let preview = content;
    
    if (selectedCustomer) {
      preview = preview.replace(/{{customer_name}}/g, `${selectedCustomer.first_name} ${selectedCustomer.last_name}`);
      preview = preview.replace(/{{customer_first_name}}/g, selectedCustomer.first_name);
      preview = preview.replace(/{{customer_email}}/g, selectedCustomer.email || '');
      preview = preview.replace(/{{customer_phone}}/g, selectedCustomer.phone || '');
    }
    
    if (selectedPuppy) {
      preview = preview.replace(/{{puppy_name}}/g, selectedPuppy.name || '');
      preview = preview.replace(/{{puppy_gender}}/g, selectedPuppy.gender || '');
      preview = preview.replace(/{{puppy_color}}/g, selectedPuppy.color || '');
      preview = preview.replace(/{{puppy_weight}}/g, selectedPuppy.current_weight || '');
      
      if (selectedPuppy.birth_date) {
        const birthDate = new Date(selectedPuppy.birth_date);
        const today = new Date();
        const ageInWeeks = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        preview = preview.replace(/{{puppy_age}}/g, `${ageInWeeks}`);
      }
    }
    
    // Replace any remaining variables with generic placeholders
    preview = preview.replace(/{{custom_message}}/g, customMessage || '[Custom message will appear here]');
    preview = preview.replace(/{{pickup_date}}/g, '[Pickup date]');
    preview = preview.replace(/{{vaccinations}}/g, '[Vaccination details]');
    
    setPreviewContent(preview);
  }, [content, customMessage, selectedCustomer, selectedPuppy]);

  const onSubmit = async (values: SendFormValues) => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Record the communication in our database
      const { error } = await supabase
        .from('customer_communications')
        .insert([{
          customer_id: values.customer_id,
          type: values.type,
          subject: values.subject,
          content: previewContent,
          status: 'sent' // In a real app, this would be 'pending' until confirmed
        }]);
      
      if (error) throw error;
      
      // In a real application, you would integrate with an email or SMS service here
      // For example, using SendGrid for email or Twilio for SMS
      
      // Success notification
      toast({
        title: "Communication sent",
        description: `Your ${values.type} has been sent successfully to ${selectedCustomer.first_name} ${selectedCustomer.last_name}.`
      });
      
      // Reset form after sending
      form.reset({
        type: 'email',
        subject: '',
        content: '',
        custom_message: ''
      });
      
      setSelectedCustomer(null);
      setSelectedPuppy(null);
    } catch (error: any) {
      toast({
        title: "Error sending communication",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCustomerSelected = (customer: any) => {
    setValue('customer_id', customer.id);
    setSelectedCustomer(customer);
  };

  const handlePuppyChange = (value: string) => {
    setValue('puppy_id', value);
    
    if (!value) {
      setSelectedPuppy(null);
      return;
    }
    
    const puppy = puppies.find(p => p.id === value);
    setSelectedPuppy(puppy);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Send Communication</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={() => (
                    <FormItem>
                      <FormLabel>Customer*</FormLabel>
                      <CustomerSelector onCustomerSelected={handleCustomerSelected} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {puppies.length > 0 && (
                  <FormField
                    control={form.control}
                    name="puppy_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puppy (Optional)</FormLabel>
                        <Select 
                          value={field.value}
                          onValueChange={handlePuppyChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a puppy" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {puppies.map((puppy) => (
                              <SelectItem key={puppy.id} value={puppy.id}>
                                {puppy.name || `Puppy #${puppy.id.substring(0, 6)}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates?.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name} ({template.type})
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Type*</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
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
                
                {selectedType === 'email' && (
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
                
                <FormField
                  control={form.control}
                  name="custom_message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add a personalized message..." 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <Tabs defaultValue="compose" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="compose" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Content*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Type your message here..." 
                              className="min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          {selectedType === 'sms' && field.value && (
                            <div className="mt-1">
                              <SmsCharacterCounter text={field.value} />
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <VariableHelp />
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    {previewContent ? (
                      <MessagePreview 
                        messageType={selectedType} 
                        subject={selectedType === 'email' ? form.getValues('subject') : undefined}
                        content={previewContent}
                      />
                    ) : (
                      <div className="border rounded-md p-4 min-h-[300px] bg-muted/30 flex items-center justify-center">
                        <p className="text-muted-foreground">Enter content to see preview</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="text-center pt-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!form.formState.isValid || !selectedCustomer || isSending}
                  >
                    {isSending ? "Sending..." : `Send ${selectedType === 'email' ? 'Email' : 'SMS'}`}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendCommunication;
