
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBreedingPreparation } from '../../hooks/useBreedingPreparation';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dog } from '@/types/dog';

const breedingFormSchema = z.object({
  damId: z.string().min(1, "Dam selection is required"),
  sireId: z.string().min(1, "Sire selection is required"),
  plannedTieDate: z.date({
    required_error: "Planned breeding date is required",
  }),
  notes: z.string().optional(),
});

type BreedingFormValues = z.infer<typeof breedingFormSchema>;

const BreedingPrepTab: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDam, setSelectedDam] = useState<Dog | null>(null);
  const [selectedSire, setSelectedSire] = useState<Dog | null>(null);
  const [compatibilityResult, setCompatibilityResult] = useState<{ 
    compatible: boolean; 
    message: string;
    warnings: string[];
  } | null>(null);
  
  const { 
    femaleDogs, 
    maleDogs, 
    createBreedingRecord, 
    getDefaultChecklistItems,
    checkGeneticCompatibility,
    isLoading,
    isCreating
  } = useBreedingPreparation();
  
  const form = useForm<BreedingFormValues>({
    resolver: zodResolver(breedingFormSchema),
    defaultValues: {
      damId: "",
      sireId: "",
      notes: "",
    },
  });
  
  const onSubmit = async (values: BreedingFormValues) => {
    try {
      await createBreedingRecord(values as any);
      navigate('/welping');
    } catch (error) {
      console.error("Error creating breeding record:", error);
    }
  };
  
  const handleDamChange = (damId: string) => {
    form.setValue('damId', damId);
    const dam = femaleDogs.find(dog => dog.id === damId) || null;
    setSelectedDam(dam);
    
    // Reset compatibility when dam changes
    setCompatibilityResult(null);
  };
  
  const handleSireChange = (sireId: string) => {
    form.setValue('sireId', sireId);
    const sire = maleDogs.find(dog => dog.id === sireId) || null;
    setSelectedSire(sire);
    
    // Reset compatibility when sire changes
    setCompatibilityResult(null);
  };
  
  const handleCheckCompatibility = async () => {
    const damId = form.getValues('damId');
    const sireId = form.getValues('sireId');
    
    if (damId && sireId) {
      const result = await checkGeneticCompatibility(damId, sireId);
      setCompatibilityResult(result);
    }
  };
  
  const checklistItems = getDefaultChecklistItems();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Breeding Preparation</CardTitle>
          <CardDescription>
            Plan and prepare for breeding by selecting compatible dogs and setting up a schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 1: Select Dogs for Breeding</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="damId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Dam (Female)</FormLabel>
                          <Select 
                            onValueChange={(value) => handleDamChange(value)} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a female dog" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {femaleDogs.map((dog) => (
                                <SelectItem key={dog.id} value={dog.id}>
                                  {dog.name} ({dog.breed || 'Unknown breed'})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the female dog for breeding
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sireId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Sire (Male)</FormLabel>
                          <Select 
                            onValueChange={(value) => handleSireChange(value)} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a male dog" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {maleDogs.map((dog) => (
                                <SelectItem key={dog.id} value={dog.id}>
                                  {dog.name} ({dog.breed || 'Unknown breed'})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the male dog for breeding
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {selectedDam && selectedSire && (
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleCheckCompatibility}
                      >
                        Check Compatibility
                      </Button>
                    </div>
                  )}
                  
                  {compatibilityResult && (
                    <Card className={cn(
                      "border",
                      compatibilityResult.compatible 
                        ? "border-green-200 bg-green-50" 
                        : "border-red-200 bg-red-50"
                    )}>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Compatibility Check</h4>
                        <p>{compatibilityResult.message}</p>
                        {compatibilityResult.warnings.length > 0 && (
                          <div className="mt-2">
                            <h5 className="font-medium">Warnings:</h5>
                            <ul className="list-disc pl-5">
                              {compatibilityResult.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setStep(2)}
                      disabled={!form.getValues('damId') || !form.getValues('sireId')}
                    >
                      Next Step
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 2: Schedule and Preparation</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="plannedTieDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Planned Breeding Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
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
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          The date when breeding is planned to occur
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
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
                            placeholder="Add any notes about this breeding plan"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Additional information about the breeding plan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Previous Step
                    </Button>
                    <Button type="button" onClick={() => setStep(3)}>
                      Next Step
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 3: Preparation Checklist</h3>
              
              <div className="space-y-4">
                {checklistItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-2 p-3 rounded-md border"
                  >
                    <Checkbox id={`checklist-${item.id}`} />
                    <div className="flex-1">
                      <label 
                        htmlFor={`checklist-${item.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {item.title}
                      </label>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Previous Step
                </Button>
                <Button 
                  type="button" 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Breeding Record"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BreedingPrepTab;
