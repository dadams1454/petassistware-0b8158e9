
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import WeightInput from '@/components/dogs/form/WeightInput';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, RotateCw, Utensils, FilePlus, Scale, Pill, List, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { PuppyWithAge } from '@/types/puppyTracking';

// Form schema
const careLogSchema = z.object({
  care_type: z.enum(['feeding', 'potty', 'weight', 'medication', 'milestone', 'note']),
  timestamp: z.string().default(() => new Date().toISOString()),
  notes: z.string().optional(),
  // Feeding specific
  feeding_type: z.string().optional(),
  feeding_amount: z.string().optional(),
  feeding_unit: z.string().optional(),
  // Weight specific
  weight: z.string().optional(),
  weight_unit: z.enum(['oz', 'g']).default('oz').optional(),
  // Medication specific
  medication_name: z.string().optional(),
  medication_dosage: z.string().optional(),
  medication_unit: z.string().optional(),
  // Milestone specific
  milestone_type: z.string().optional(),
  milestone_title: z.string().optional(),
});

type CareLogFormValues = z.infer<typeof careLogSchema>;

interface PuppyCareLogProps {
  puppyId: string;
  puppyInfo?: {
    name: string;
    age_days: number;
    gender: string;
    color: string;
  };
  onSuccess?: () => void;
  onRefresh?: () => void;
}

interface CareLogEntry {
  id: string;
  puppy_id: string;
  care_type: string;
  timestamp: string;
  created_at: string;
  notes?: string;
  details?: any;
}

const PuppyCareLog: React.FC<PuppyCareLogProps> = ({
  puppyId,
  puppyInfo,
  onSuccess,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('feeding');
  const [careLogs, setCareLogs] = useState<CareLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<CareLogFormValues>({
    resolver: zodResolver(careLogSchema),
    defaultValues: {
      care_type: 'feeding',
      timestamp: new Date().toISOString(),
      notes: '',
    }
  });
  
  // Watch form values for conditional fields
  const careType = form.watch('care_type');
  
  // Load care logs
  useEffect(() => {
    if (puppyId) {
      fetchCareLogs();
    }
  }, [puppyId]);
  
  const fetchCareLogs = async () => {
    setIsLoading(true);
    try {
      // Get care logs from various tables
      const [feedingLogs, weightLogs, medicationLogs, milestoneLogs, generalLogs] = await Promise.all([
        // Feeding logs
        supabase
          .from('feeding_records')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('timestamp', { ascending: false }),
        
        // Weight logs  
        supabase
          .from('weight_records')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('date', { ascending: false }),
        
        // Medication logs
        supabase
          .from('health_records')
          .select('*')
          .eq('puppy_id', puppyId)
          .eq('record_type', 'medication')
          .order('created_at', { ascending: false }),
        
        // Milestones
        supabase
          .from('puppy_milestones')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('milestone_date', { ascending: false }),
        
        // General notes/logs
        supabase
          .from('puppy_care_logs')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('timestamp', { ascending: false })
      ]);
      
      // Transform to unified format
      const allLogs: CareLogEntry[] = [
        ...(feedingLogs.data || []).map((log: any) => ({
          id: log.id,
          puppy_id: log.puppy_id,
          care_type: 'feeding',
          timestamp: log.timestamp,
          created_at: log.created_at,
          notes: log.notes,
          details: {
            food_type: log.food_type,
            amount_offered: log.amount_offered,
            amount_consumed: log.amount_consumed
          }
        })),
        
        ...(weightLogs.data || []).map((log: any) => ({
          id: log.id,
          puppy_id: log.puppy_id,
          care_type: 'weight',
          timestamp: log.date,
          created_at: log.created_at,
          notes: log.notes,
          details: {
            weight: log.weight,
            weight_unit: log.weight_unit,
            percent_change: log.percent_change
          }
        })),
        
        ...(medicationLogs.data || []).map((log: any) => ({
          id: log.id,
          puppy_id: log.puppy_id,
          care_type: 'medication',
          timestamp: log.created_at,
          created_at: log.created_at,
          notes: log.record_notes,
          details: {
            medication_name: log.medication_name,
            dosage: log.dosage,
            dosage_unit: log.dosage_unit
          }
        })),
        
        ...(milestoneLogs.data || []).map((log: any) => ({
          id: log.id,
          puppy_id: log.puppy_id,
          care_type: 'milestone',
          timestamp: log.milestone_date,
          created_at: log.created_at,
          notes: log.notes,
          details: {
            milestone_type: log.milestone_type,
            title: log.title || log.milestone_type
          }
        })),
        
        ...(generalLogs.data || []).map((log: any) => ({
          id: log.id,
          puppy_id: log.puppy_id,
          care_type: log.care_type || 'note',
          timestamp: log.timestamp,
          created_at: log.created_at,
          notes: log.notes,
          details: log.details
        }))
      ];
      
      // Sort by timestamp (most recent first)
      allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setCareLogs(allLogs);
    } catch (error) {
      console.error('Error fetching care logs:', error);
      toast({
        title: "Error",
        description: "Failed to load care logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update care type in form
    switch (value) {
      case 'feeding':
      case 'potty':
      case 'weight':
      case 'medication':
      case 'milestone':
      case 'note':
        form.setValue('care_type', value as any);
        break;
      default:
        break;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (values: CareLogFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Different logic based on care type
      switch (values.care_type) {
        case 'feeding':
          await handleFeedingLog(values);
          break;
        case 'potty':
          await handlePottyLog(values);
          break;
        case 'weight':
          await handleWeightLog(values);
          break;
        case 'medication':
          await handleMedicationLog(values);
          break;
        case 'milestone':
          await handleMilestoneLog(values);
          break;
        case 'note':
          await handleNoteLog(values);
          break;
      }
      
      // Reset form
      form.reset({
        care_type: values.care_type,
        timestamp: new Date().toISOString(),
        notes: '',
      });
      
      toast({
        title: "Log Added",
        description: `${values.care_type} log added successfully.`,
      });
      
      // Refresh logs
      await fetchCareLogs();
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error adding care log:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add care log.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle specific log types
  const handleFeedingLog = async (values: CareLogFormValues) => {
    await supabase
      .from('feeding_records')
      .insert({
        puppy_id: puppyId,
        timestamp: values.timestamp,
        food_type: values.feeding_type || 'Milk',
        amount_offered: values.feeding_amount || '',
        notes: values.notes,
        staff_id: 'system' // Placeholder
      });
  };
  
  const handlePottyLog = async (values: CareLogFormValues) => {
    await supabase
      .from('puppy_care_logs')
      .insert({
        puppy_id: puppyId,
        care_type: 'potty',
        timestamp: values.timestamp,
        notes: values.notes,
        details: {
          success: true
        }
      });
  };
  
  const handleWeightLog = async (values: CareLogFormValues) => {
    if (!values.weight) throw new Error("Weight is required");
    
    await supabase
      .from('weight_records')
      .insert({
        puppy_id: puppyId,
        weight: parseFloat(values.weight),
        weight_unit: values.weight_unit || 'oz',
        date: values.timestamp,
        notes: values.notes
      });
  };
  
  const handleMedicationLog = async (values: CareLogFormValues) => {
    if (!values.medication_name) throw new Error("Medication name is required");
    
    await supabase
      .from('health_records')
      .insert({
        puppy_id: puppyId,
        record_type: 'medication',
        visit_date: new Date(values.timestamp).toISOString().split('T')[0],
        medication_name: values.medication_name,
        dosage: values.medication_dosage,
        dosage_unit: values.medication_unit,
        record_notes: values.notes,
        title: `Medication: ${values.medication_name}`
      });
  };
  
  const handleMilestoneLog = async (values: CareLogFormValues) => {
    if (!values.milestone_type) throw new Error("Milestone type is required");
    
    await supabase
      .from('puppy_milestones')
      .insert({
        puppy_id: puppyId,
        milestone_type: values.milestone_type,
        title: values.milestone_title || values.milestone_type,
        milestone_date: values.timestamp,
        notes: values.notes
      });
  };
  
  const handleNoteLog = async (values: CareLogFormValues) => {
    await supabase
      .from('puppy_care_logs')
      .insert({
        puppy_id: puppyId,
        care_type: 'note',
        timestamp: values.timestamp,
        notes: values.notes
      });
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return timestamp;
    }
  };
  
  // Get care type icon
  const getCareTypeIcon = (type: string) => {
    switch (type) {
      case 'feeding':
        return <Utensils className="h-4 w-4" />;
      case 'potty':
        return <FilePlus className="h-4 w-4" />;
      case 'weight':
        return <Scale className="h-4 w-4" />;
      case 'medication':
        return <Pill className="h-4 w-4" />;
      case 'milestone':
        return <List className="h-4 w-4" />;
      case 'note':
      default:
        return <FilePlus className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Care Log for {puppyInfo?.name || 'Puppy'}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => fetchCareLogs()}
              disabled={isLoading}
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
          {puppyInfo && (
            <div className="text-sm text-muted-foreground">
              {puppyInfo.gender}, {puppyInfo.color}, {puppyInfo.age_days} days old
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="feeding">
                <Utensils className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Feeding</span>
              </TabsTrigger>
              <TabsTrigger value="potty">
                <FilePlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Potty</span>
              </TabsTrigger>
              <TabsTrigger value="weight">
                <Scale className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Weight</span>
              </TabsTrigger>
              <TabsTrigger value="medication">
                <Pill className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Meds</span>
              </TabsTrigger>
              <TabsTrigger value="milestone">
                <List className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Milestone</span>
              </TabsTrigger>
              <TabsTrigger value="note">
                <FilePlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Note</span>
              </TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                {/* Common fields for all care types */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timestamp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Feeding specific fields */}
                <TabsContent value="feeding" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="feeding_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select food type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Milk">Milk</SelectItem>
                              <SelectItem value="Formula">Formula</SelectItem>
                              <SelectItem value="Wet Food">Wet Food</SelectItem>
                              <SelectItem value="Kibble">Kibble</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="feeding_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 10ml" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any additional notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Potty specific fields */}
                <TabsContent value="potty" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potty Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any potty details (urine, stool, etc.)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Weight specific fields */}
                <TabsContent value="weight" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <WeightInput
                        form={form}
                        name="weight"
                        label="Weight"
                        defaultUnit="oz"
                      />
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any additional notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Medication specific fields */}
                <TabsContent value="medication" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="medication_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medication</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Medication name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="medication_dosage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 0.5ml" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any additional notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Milestone specific fields */}
                <TabsContent value="milestone" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="milestone_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Milestone Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select milestone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="eyes_open">Eyes Open</SelectItem>
                              <SelectItem value="ears_open">Ears Open</SelectItem>
                              <SelectItem value="first_walk">First Walk</SelectItem>
                              <SelectItem value="first_bark">First Bark</SelectItem>
                              <SelectItem value="solid_food">First Solid Food</SelectItem>
                              <SelectItem value="teeth">First Teeth</SelectItem>
                              <SelectItem value="social">Social Development</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="milestone_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Milestone title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any additional notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Note specific fields */}
                <TabsContent value="note" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter general notes about the puppy"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Add Log Entry'}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Care History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <RotateCw className="h-6 w-6 animate-spin" />
            </div>
          ) : careLogs.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No care logs found for this puppy.
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careLogs.map((log) => (
                    <TableRow key={`${log.id}-${log.care_type}`}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getCareTypeIcon(log.care_type)}
                          <span className="ml-1 capitalize">{log.care_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.care_type === 'feeding' && log.details && (
                          <span>
                            {log.details.food_type || 'Food'} 
                            {log.details.amount_offered && ` (${log.details.amount_offered})`}
                          </span>
                        )}
                        
                        {log.care_type === 'weight' && log.details && (
                          <span>
                            {log.details.weight} {log.details.weight_unit}
                            {log.details.percent_change && log.details.percent_change !== 0 && (
                              <span className={log.details.percent_change > 0 ? "text-green-600" : "text-red-600"}>
                                {" "}({log.details.percent_change > 0 ? "+" : ""}{log.details.percent_change}%)
                              </span>
                            )}
                          </span>
                        )}
                        
                        {log.care_type === 'medication' && log.details && (
                          <span>
                            {log.details.medication_name}
                            {log.details.dosage && ` (${log.details.dosage}${log.details.dosage_unit || ''})`}
                          </span>
                        )}
                        
                        {log.care_type === 'milestone' && log.details && (
                          <span>
                            {log.details.title || log.details.milestone_type || 'Milestone'}
                          </span>
                        )}
                        
                        {(log.care_type === 'potty' || log.care_type === 'note' || !log.details) && (
                          <span>{log.notes || 'No details'}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyCareLog;
