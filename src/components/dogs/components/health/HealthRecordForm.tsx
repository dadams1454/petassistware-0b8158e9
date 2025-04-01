
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { HealthRecordTypeEnum } from '@/types/health';

const healthRecordSchema = z.object({
  record_type: z.nativeEnum(HealthRecordTypeEnum, {
    required_error: 'Record type is required',
  }),
  date: z.date({
    required_error: 'Date is required',
  }),
  title: z.string().min(1, 'Title is required'),
  performed_by: z.string().min(1, 'Performed by is required'),
  description: z.string().optional(),
  has_next_due_date: z.boolean().default(false),
  next_due_date: z.date().optional(),
  // Medication specific fields
  medication_name: z.string().optional(),
  dosage: z.string().optional(),
  dosage_unit: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  duration_unit: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  // Vaccination specific fields
  vaccine_name: z.string().optional(),
  manufacturer: z.string().optional(),
  lot_number: z.string().optional(),
  administration_route: z.string().optional(),
  // Examination specific fields
  examination_type: z.string().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  follow_up_date: z.date().optional(),
  // Surgery specific fields
  procedure_name: z.string().optional(),
  surgeon: z.string().optional(),
  anesthesia_used: z.string().optional(),
  recovery_notes: z.string().optional(),
});

type HealthRecordFormValues = z.infer<typeof healthRecordSchema>;

interface HealthRecordFormProps {
  dogId: string;
  recordType?: HealthRecordTypeEnum;
  recordId?: string;
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  dogId,
  recordType = HealthRecordTypeEnum.Examination,
  recordId,
  initialData,
  onSave,
  onCancel
}) => {
  const [selectedType, setSelectedType] = useState<HealthRecordTypeEnum>(
    initialData?.record_type || recordType
  );
  
  // Initialize the form with data or defaults
  const form = useForm<HealthRecordFormValues>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: initialData ? {
      record_type: initialData.record_type,
      date: initialData.date ? new Date(initialData.date) : new Date(),
      title: initialData.title || '',
      performed_by: initialData.performed_by || '',
      description: initialData.description || '',
      has_next_due_date: !!initialData.next_due_date,
      next_due_date: initialData.next_due_date ? new Date(initialData.next_due_date) : undefined,
      // Medication fields
      medication_name: initialData.medication_name || '',
      dosage: initialData.dosage ? String(initialData.dosage) : '',
      dosage_unit: initialData.dosage_unit || '',
      frequency: initialData.frequency || '',
      duration: initialData.duration ? String(initialData.duration) : '',
      duration_unit: initialData.duration_unit || '',
      start_date: initialData.start_date ? new Date(initialData.start_date) : undefined,
      end_date: initialData.end_date ? new Date(initialData.end_date) : undefined,
      // Vaccination fields
      vaccine_name: initialData.vaccine_name || '',
      manufacturer: initialData.manufacturer || '',
      lot_number: initialData.lot_number || '',
      administration_route: initialData.administration_route || '',
      // Examination fields
      examination_type: initialData.examination_type || '',
      findings: initialData.findings || '',
      recommendations: initialData.recommendations || '',
      follow_up_date: initialData.follow_up_date ? new Date(initialData.follow_up_date) : undefined,
      // Surgery fields
      procedure_name: initialData.procedure_name || '',
      surgeon: initialData.surgeon || initialData.performed_by || '',
      anesthesia_used: initialData.anesthesia_used || '',
      recovery_notes: initialData.recovery_notes || '',
    } : {
      record_type: recordType,
      date: new Date(),
      title: '',
      performed_by: '',
      description: '',
      has_next_due_date: false,
    }
  });
  
  // Watch for record type changes to show relevant fields
  const watchRecordType = form.watch('record_type');
  const hasNextDueDate = form.watch('has_next_due_date');
  
  // Update selected type when form value changes
  React.useEffect(() => {
    if (watchRecordType) {
      setSelectedType(watchRecordType);
    }
  }, [watchRecordType]);
  
  const handleSubmit = (values: HealthRecordFormValues) => {
    // Prepare the record data based on the form values
    const recordData = {
      dog_id: dogId,
      record_type: values.record_type,
      date: values.date.toISOString(),
      visit_date: values.date.toISOString(), // For database compatibility
      title: values.title,
      performed_by: values.performed_by,
      description: values.description,
      next_due_date: values.has_next_due_date && values.next_due_date 
        ? values.next_due_date.toISOString() 
        : undefined,
    };
    
    // Add type-specific fields
    let typeSpecificData = {};
    
    switch (values.record_type) {
      case HealthRecordTypeEnum.Medication:
        typeSpecificData = {
          medication_name: values.medication_name,
          dosage: values.dosage ? parseFloat(values.dosage) : undefined,
          dosage_unit: values.dosage_unit,
          frequency: values.frequency,
          duration: values.duration ? parseFloat(values.duration) : undefined,
          duration_unit: values.duration_unit,
          start_date: values.start_date?.toISOString(),
          end_date: values.end_date?.toISOString(),
        };
        break;
      case HealthRecordTypeEnum.Vaccination:
        typeSpecificData = {
          vaccine_name: values.vaccine_name,
          manufacturer: values.manufacturer,
          lot_number: values.lot_number,
          administration_route: values.administration_route,
        };
        break;
      case HealthRecordTypeEnum.Examination:
        typeSpecificData = {
          examination_type: values.examination_type,
          findings: values.findings,
          recommendations: values.recommendations,
          follow_up_date: values.follow_up_date?.toISOString(),
        };
        break;
      case HealthRecordTypeEnum.Surgery:
        typeSpecificData = {
          procedure_name: values.procedure_name,
          surgeon: values.surgeon || values.performed_by,
          anesthesia_used: values.anesthesia_used,
          recovery_notes: values.recovery_notes,
        };
        break;
    }
    
    // Combine the base record data with type-specific fields
    const finalData = {
      ...recordData,
      ...typeSpecificData,
      ...(recordId ? { id: recordId } : {}),
    };
    
    onSave(finalData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="record_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type*</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedType(value as HealthRecordTypeEnum);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={HealthRecordTypeEnum.Vaccination}>Vaccination</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Examination}>Examination</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Medication}>Medication</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Surgery}>Surgery</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Observation}>Observation</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Deworming}>Deworming</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Grooming}>Grooming</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Dental}>Dental</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Allergy}>Allergy</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Test}>Test/Screening</SelectItem>
                    <SelectItem value={HealthRecordTypeEnum.Other}>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="pointer-events-auto"
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`E.g., ${
                    selectedType === HealthRecordTypeEnum.Vaccination ? "Rabies Vaccination" : 
                    selectedType === HealthRecordTypeEnum.Examination ? "Annual Checkup" :
                    selectedType === HealthRecordTypeEnum.Medication ? "Heartworm Prevention" :
                    selectedType === HealthRecordTypeEnum.Surgery ? "Spay/Neuter Procedure" :
                    "Health Record Title"
                  }`} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="performed_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performed By*</FormLabel>
              <FormControl>
                <Input placeholder="Veterinarian or staff name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Conditional fields based on record type */}
        {selectedType === HealthRecordTypeEnum.Medication && (
          <div className="border p-4 rounded-md space-y-4">
            <h3 className="font-medium text-sm">Medication Details</h3>
            
            <FormField
              control={form.control}
              name="medication_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Amoxicillin, Metacam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., 50" {...field} />
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
                        <SelectItem value="tablet">tablet</SelectItem>
                        <SelectItem value="capsule">capsule</SelectItem>
                        <SelectItem value="drop">drop</SelectItem>
                        <SelectItem value="other">other</SelectItem>
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
                  <FormControl>
                    <Input placeholder="e.g., Once daily, Twice daily, Every 8 hours" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., 7, 14" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="days">days</SelectItem>
                        <SelectItem value="weeks">weeks</SelectItem>
                        <SelectItem value="months">months</SelectItem>
                        <SelectItem value="ongoing">ongoing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
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
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
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
        
        {selectedType === HealthRecordTypeEnum.Vaccination && (
          <div className="border p-4 rounded-md space-y-4">
            <h3 className="font-medium text-sm">Vaccination Details</h3>
            
            <FormField
              control={form.control}
              name="vaccine_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rabies, DHPP, Bordetella" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Zoetis, Merck" {...field} />
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
                      <Input placeholder="e.g., 123ABC456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
                      <SelectItem value="subcutaneous">Subcutaneous (SQ)</SelectItem>
                      <SelectItem value="intramuscular">Intramuscular (IM)</SelectItem>
                      <SelectItem value="intranasal">Intranasal</SelectItem>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {selectedType === HealthRecordTypeEnum.Examination && (
          <div className="border p-4 rounded-md space-y-4">
            <h3 className="font-medium text-sm">Examination Details</h3>
            
            <FormField
              control={form.control}
              name="examination_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Examination Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select examination type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wellness">Wellness Check</SelectItem>
                      <SelectItem value="annual">Annual Exam</SelectItem>
                      <SelectItem value="sick">Sick Visit</SelectItem>
                      <SelectItem value="followup">Follow-up Visit</SelectItem>
                      <SelectItem value="specialist">Specialist Consultation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="findings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Findings</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Clinical findings from the examination"
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
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
                      placeholder="Treatment recommendations and next steps"
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="follow_up_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Follow-up Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {selectedType === HealthRecordTypeEnum.Surgery && (
          <div className="border p-4 rounded-md space-y-4">
            <h3 className="font-medium text-sm">Surgery Details</h3>
            
            <FormField
              control={form.control}
              name="procedure_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procedure Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Spay, Neuter, Dental Cleaning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="surgeon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surgeon</FormLabel>
                  <FormControl>
                    <Input placeholder="Surgeon's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="anesthesia_used"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anesthesia Used</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Isoflurane, Propofol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recovery_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recovery Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Post-surgery recovery observations and instructions"
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about the health record"
                  className="min-h-[100px]" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="has_next_due_date"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Set Next Due Date</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {hasNextDueDate && (
          <FormField
            control={form.control}
            name="next_due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Next Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date <= new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Record
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthRecordForm;
