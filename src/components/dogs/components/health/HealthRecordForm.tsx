
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  HealthRecord, 
  HealthRecordTypeEnum 
} from '@/types/health';

// Form schema
const healthRecordSchema = z.object({
  record_type: z.string(),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  visit_date: z.date({ required_error: 'Date is required.' }),
  vet_name: z.string().optional(),
  record_notes: z.string().optional(),
  next_due_date: z.date().optional().nullable(),
  document_url: z.string().optional(),
  
  // Vaccination fields
  vaccine_name: z.string().optional(),
  manufacturer: z.string().optional(),
  lot_number: z.string().optional(),
  expiration_date: z.date().optional().nullable(),
  
  // Medication fields
  medication_name: z.string().optional(),
  dosage: z.string().optional(),
  dosage_unit: z.string().optional(),
  frequency: z.string().optional(),
  start_date: z.date().optional().nullable(),
  end_date: z.date().optional().nullable(),
  administration_route: z.string().optional(),
  
  // Examination fields
  examination_type: z.string().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  follow_up_date: z.date().optional().nullable(),
});

export interface HealthRecordFormProps {
  recordType?: HealthRecordTypeEnum;
  recordId?: string;
  initialData?: HealthRecord | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  dogId?: string; // Make dogId optional for compatibility
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  recordType,
  recordId,
  initialData,
  onSave,
  onCancel,
  dogId
}) => {
  const [selectedType, setSelectedType] = useState<string>(
    recordType || initialData?.record_type || HealthRecordTypeEnum.VACCINATION
  );
  
  // Initialize form with default values or existing record data
  const form = useForm<z.infer<typeof healthRecordSchema>>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      record_type: selectedType,
      title: initialData?.title || '',
      visit_date: initialData?.visit_date ? new Date(initialData.visit_date) : new Date(),
      vet_name: initialData?.vet_name || '',
      record_notes: initialData?.record_notes || '',
      next_due_date: initialData?.next_due_date ? new Date(initialData.next_due_date) : null,
      document_url: initialData?.document_url || '',
      
      // Vaccination fields
      vaccine_name: initialData?.vaccine_name || '',
      manufacturer: initialData?.manufacturer || '',
      lot_number: initialData?.lot_number || '',
      expiration_date: initialData?.expiration_date ? new Date(initialData.expiration_date) : null,
      
      // Medication fields
      medication_name: initialData?.medication_name || '',
      dosage: initialData?.dosage ? String(initialData.dosage) : '',
      dosage_unit: initialData?.dosage_unit || '',
      frequency: initialData?.frequency || '',
      start_date: initialData?.start_date ? new Date(initialData.start_date) : null,
      end_date: initialData?.end_date ? new Date(initialData.end_date) : null,
      administration_route: initialData?.administration_route || '',
      
      // Examination fields
      examination_type: initialData?.examination_type || '',
      findings: initialData?.findings || '',
      recommendations: initialData?.recommendations || '',
      follow_up_date: initialData?.follow_up_date ? new Date(initialData.follow_up_date) : null,
    }
  });
  
  // Handle record type changes
  useEffect(() => {
    if (recordType && recordType !== selectedType) {
      setSelectedType(recordType);
      form.setValue('record_type', recordType);
    }
  }, [recordType, form, selectedType]);
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof healthRecordSchema>) => {
    // Format dates to ISO strings
    const formattedData = {
      ...data,
      dog_id: dogId,
      visit_date: data.visit_date ? format(data.visit_date, 'yyyy-MM-dd') : undefined,
      next_due_date: data.next_due_date ? format(data.next_due_date, 'yyyy-MM-dd') : undefined,
      expiration_date: data.expiration_date ? format(data.expiration_date, 'yyyy-MM-dd') : undefined,
      start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : undefined,
      end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : undefined,
      follow_up_date: data.follow_up_date ? format(data.follow_up_date, 'yyyy-MM-dd') : undefined,
      dosage: data.dosage ? parseFloat(data.dosage) : undefined,
    };
    
    onSave(formattedData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Record type selection */}
        <FormField
          control={form.control}
          name="record_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Record Type</FormLabel>
              <Select
                disabled={!!recordId}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedType(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a record type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={HealthRecordTypeEnum.VACCINATION}>Vaccination</SelectItem>
                  <SelectItem value={HealthRecordTypeEnum.EXAMINATION}>Examination</SelectItem>
                  <SelectItem value={HealthRecordTypeEnum.MEDICATION}>Medication</SelectItem>
                  <SelectItem value={HealthRecordTypeEnum.SURGERY}>Surgery</SelectItem>
                  <SelectItem value={HealthRecordTypeEnum.TEST}>Test</SelectItem>
                  <SelectItem value={HealthRecordTypeEnum.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Common fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="visit_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vet_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinarian</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Render different fields based on selected record type */}
        {selectedType === HealthRecordTypeEnum.VACCINATION && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vaccine_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vaccine Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lot_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        {selectedType === HealthRecordTypeEnum.MEDICATION && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="medication_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dosage_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mg">mg</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="tablet">tablet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Once Daily</SelectItem>
                        <SelectItem value="twice_daily">Twice Daily</SelectItem>
                        <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                        <SelectItem value="every_other_day">Every Other Day</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Every Two Weeks</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="as_needed">As Needed</SelectItem>
                        <SelectItem value="one_time">One Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="administration_route"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Administration Route</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="inhalation">Inhalation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        {selectedType === HealthRecordTypeEnum.EXAMINATION && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="examination_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Examination Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="wellness">Wellness Exam</SelectItem>
                        <SelectItem value="sick">Sick Visit</SelectItem>
                        <SelectItem value="follow_up">Follow-up</SelectItem>
                        <SelectItem value="specialty">Specialty Consultation</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="findings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Findings</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px]"
                      placeholder="Enter examination findings"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px]"
                      placeholder="Enter veterinarian's recommendations"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {/* Common fields for all record types */}
        <FormField
          control={form.control}
          name="record_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px]"
                  placeholder="Enter any additional notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="next_due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>No follow-up needed</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="document_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/document.pdf" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Form actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {recordId ? 'Update Record' : 'Save Record'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthRecordForm;
