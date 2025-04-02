
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format, addWeeks, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Dog } from '@/types/litter';

const matingSchema = z.object({
  dam_id: z.string({ required_error: "Dam is required" }),
  sire_id: z.string({ required_error: "Sire is required" }),
  first_mating_date: z.date({ required_error: "Mating date is required" }),
  last_mating_date: z.date().optional(),
  notes: z.string().optional(),
  planned_litter_name: z.string().optional()
});

type MatingFormValues = z.infer<typeof matingSchema>;

interface BreedingPlanFormProps {
  initialDamId?: string;
  initialSireId?: string;
  onSuccess?: () => void;
}

interface MockInbreedingResult {
  coi: number;
  risk: 'low' | 'medium' | 'high';
  generations: number;
  common_ancestors: string[];
}

const BreedingPlanForm: React.FC<BreedingPlanFormProps> = ({
  initialDamId,
  initialSireId,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [females, setFemales] = useState<Dog[]>([]);
  const [males, setMales] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [inbreedingResult, setInbreedingResult] = useState<MockInbreedingResult | null>(null);
  
  // Setup form with validation
  const form = useForm<MatingFormValues>({
    resolver: zodResolver(matingSchema),
    defaultValues: {
      dam_id: initialDamId || '',
      sire_id: initialSireId || '',
      first_mating_date: new Date(),
      notes: '',
      planned_litter_name: ''
    }
  });
  
  // Load available dogs
  useEffect(() => {
    const loadDogs = async () => {
      setLoading(true);
      try {
        // Fetch females (dams)
        const { data: femaleData, error: femaleError } = await supabase
          .from('dogs')
          .select('*')
          .eq('gender', 'Female');
        
        if (femaleError) throw femaleError;
        
        // Fetch males (sires)
        const { data: maleData, error: maleError } = await supabase
          .from('dogs')
          .select('*')
          .eq('gender', 'Male');
        
        if (maleError) throw maleError;
        
        setFemales(femaleData || []);
        setMales(maleData || []);
        
        // Set initial values if provided
        if (initialDamId) {
          form.setValue('dam_id', initialDamId);
        }
        
        if (initialSireId) {
          form.setValue('sire_id', initialSireId);
        }
      } catch (error) {
        console.error('Error loading dogs:', error);
        toast({
          title: "Error",
          description: "Failed to load dogs for breeding selection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDogs();
  }, [initialDamId, initialSireId]);
  
  // Watch changes to dam_id and sire_id to calculate inbreeding coefficient
  const damId = form.watch('dam_id');
  const sireId = form.watch('sire_id');
  
  useEffect(() => {
    if (damId && sireId) {
      calculateInbreeding(damId, sireId);
    } else {
      setInbreedingResult(null);
    }
  }, [damId, sireId]);
  
  // Mock function to calculate inbreeding coefficient
  const calculateInbreeding = (damId: string, sireId: string) => {
    // In a real app, this would call an API or do a pedigree analysis
    // For demonstration, generate a mock result
    
    // Create pseudorandom but consistent result based on dam and sire IDs
    const idSum = damId.charCodeAt(0) + sireId.charCodeAt(0);
    const mockCOI = (idSum % (damId === sireId ? 50 : 25)) / 100;
    
    let risk: 'low' | 'medium' | 'high';
    if (mockCOI < 0.05) risk = 'low';
    else if (mockCOI < 0.125) risk = 'medium';
    else risk = 'high';
    
    const result: MockInbreedingResult = {
      coi: mockCOI,
      risk,
      generations: 5,
      common_ancestors: damId === sireId ? 
        ['Direct relatives - not recommended!'] : 
        ['Common Great-Grandfather: Duke', 'Common Great-Great-Grandmother: Lady']
    };
    
    setInbreedingResult(result);
  };
  
  const getInbreedingBadge = () => {
    if (!inbreedingResult) return null;
    
    let color = 'bg-green-100 text-green-800';
    let icon = <CheckCircle2 className="h-4 w-4 mr-1" />;
    
    if (inbreedingResult.risk === 'medium') {
      color = 'bg-yellow-100 text-yellow-800';
      icon = <AlertCircle className="h-4 w-4 mr-1" />;
    } else if (inbreedingResult.risk === 'high') {
      color = 'bg-red-100 text-red-800';
      icon = <AlertTriangle className="h-4 w-4 mr-1" />;
    }
    
    return (
      <Badge variant="outline" className={color}>
        {icon}
        COI: {(inbreedingResult.coi * 100).toFixed(2)}% - {inbreedingResult.risk.toUpperCase()} RISK
      </Badge>
    );
  };
  
  const handleSubmit = async (values: MatingFormValues) => {
    setIsSubmitting(true);
    
    // Calculate due date (approximately 63 days after mating)
    const estimatedDueDate = addDays(values.first_mating_date, 63);
    
    try {
      // Record the mating record
      const { data, error } = await supabase
        .from('heat_cycles')
        .insert({
          dog_id: values.dam_id,
          start_date: values.first_mating_date.toISOString().split('T')[0],
          end_date: values.last_mating_date ? 
            values.last_mating_date.toISOString().split('T')[0] : 
            values.first_mating_date.toISOString().split('T')[0],
          notes: values.notes,
          fertility_indicators: {
            mating: true,
            sire_id: values.sire_id,
            planned_litter_name: values.planned_litter_name,
            estimated_due_date: estimatedDueDate.toISOString().split('T')[0]
          }
        })
        .select();
      
      if (error) throw error;
      
      // Update the dam's status to pregnant
      await supabase
        .from('dogs')
        .update({ 
          is_pregnant: true,
          tie_date: values.first_mating_date.toISOString().split('T')[0]
        })
        .eq('id', values.dam_id);
      
      toast({
        title: "Breeding Recorded",
        description: `Mating record created with expected due date of ${format(estimatedDueDate, 'MMM d, yyyy')}.`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error recording breeding:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record breeding information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Breeding</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dam_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dam (Female)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select female dog" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {females.map((dog) => (
                          <SelectItem key={dog.id} value={dog.id}>
                            {dog.name} ({dog.breed || 'Unknown breed'})
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
                name="sire_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sire (Male)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select male dog" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {males.map((dog) => (
                          <SelectItem key={dog.id} value={dog.id}>
                            {dog.name} ({dog.breed || 'Unknown breed'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {inbreedingResult && (
              <div className="p-4 border rounded">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Inbreeding Analysis</h3>
                  {getInbreedingBadge()}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Coefficient of Inbreeding (COI): {(inbreedingResult.coi * 100).toFixed(2)}%
                </p>
                
                {inbreedingResult.common_ancestors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Common Ancestors:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
                      {inbreedingResult.common_ancestors.map((ancestor, index) => (
                        <li key={index}>{ancestor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-2 text-sm">
                  {inbreedingResult.risk === 'low' && (
                    <p className="text-green-600">Low risk: This breeding has acceptable genetic diversity.</p>
                  )}
                  {inbreedingResult.risk === 'medium' && (
                    <p className="text-yellow-600">Medium risk: Consider monitoring for potential genetic issues.</p>
                  )}
                  {inbreedingResult.risk === 'high' && (
                    <p className="text-red-600">High risk: This breeding may result in health problems due to limited genetic diversity.</p>
                  )}
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_mating_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>First Mating Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_mating_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Mating Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
              name="planned_litter_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned Litter Name (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Spring 2023 Litter" />
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
                      {...field} 
                      placeholder="Enter any notes about this breeding"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Estimated due date display */}
            {form.getValues('first_mating_date') && (
              <div className="p-4 bg-muted rounded">
                <p className="font-medium">Estimated Due Date</p>
                <p className="text-2xl mt-1">
                  {format(addDays(form.getValues('first_mating_date'), 63), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Approximately 63 days from first mating date
                </p>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? 'Saving...' : 'Record Breeding'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BreedingPlanForm;
