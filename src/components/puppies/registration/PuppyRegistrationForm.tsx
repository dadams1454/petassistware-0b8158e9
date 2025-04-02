
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Toggle } from '@/components/ui/toggle';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import WeightInput from '@/components/dogs/form/WeightInput';
import { Plus, Save, X } from 'lucide-react';

const puppySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(['Male', 'Female']),
  color: z.string().min(1, 'Color is required'),
  markings: z.string().optional(),
  birth_weight: z.string().min(1, 'Birth weight is required'),
  weight_unit: z.enum(['oz', 'g']).default('oz'),
  birth_order: z.number().int().positive().optional(),
  notes: z.string().optional(),
  litter_id: z.string().uuid(),
});

type PuppyFormValues = z.infer<typeof puppySchema>;

interface PuppyRegistrationFormProps {
  litterId: string;
  litterInfo?: {
    litterName?: string;
    damName?: string;
    sireName?: string;
    birthDate?: string;
  };
  onSuccess?: () => void;
}

const PuppyRegistrationForm: React.FC<PuppyRegistrationFormProps> = ({ 
  litterId, 
  litterInfo,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [puppiesRegistered, setPuppiesRegistered] = useState<PuppyFormValues[]>([]);
  
  // Get current birth order number
  const [nextBirthOrder, setNextBirthOrder] = useState(1);
  
  // Form with zod validation
  const form = useForm<PuppyFormValues>({
    resolver: zodResolver(puppySchema),
    defaultValues: {
      litter_id: litterId,
      name: `Puppy ${nextBirthOrder}`,
      gender: 'Male',
      color: '',
      markings: '',
      birth_weight: '',
      weight_unit: 'oz',
      birth_order: nextBirthOrder,
      notes: '',
    }
  });
  
  const handleSubmit = async (values: PuppyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format data for database
      const puppyData = {
        ...values,
        litter_id: litterId,
        status: 'Available',
        birth_date: litterInfo?.birthDate || new Date().toISOString().split('T')[0],
      };
      
      // Insert puppy record
      const { data, error } = await supabase
        .from('puppies')
        .insert(puppyData)
        .select();
      
      if (error) throw error;
      
      // Add to list of registered puppies
      setPuppiesRegistered(prev => [...prev, values]);
      
      // Increment birth order for next puppy
      const newBirthOrder = nextBirthOrder + 1;
      setNextBirthOrder(newBirthOrder);
      
      // Reset form for next puppy
      form.reset({
        litter_id: litterId,
        name: `Puppy ${newBirthOrder}`,
        gender: 'Male',
        color: '',
        markings: '',
        birth_weight: '',
        weight_unit: 'oz',
        birth_order: newBirthOrder,
        notes: '',
      });
      
      toast({
        title: "Puppy Registered!",
        description: `${values.name} has been added to the litter.`,
      });
      
      // Initialize care tracking for this puppy
      await initializeCareTracking(data?.[0]?.id);
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error registering puppy:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem registering the puppy.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const initializeCareTracking = async (puppyId: string) => {
    if (!puppyId) return;
    
    try {
      // Create initial weight record
      const birthWeight = form.getValues('birth_weight');
      const weightUnit = form.getValues('weight_unit');
      
      if (birthWeight) {
        await supabase
          .from('weight_records')
          .insert({
            puppy_id: puppyId,
            weight: parseFloat(birthWeight),
            weight_unit: weightUnit,
            date: new Date().toISOString(),
            notes: 'Initial birth weight'
          });
      }
      
      // Create initial care checklist
      const today = new Date();
      
      // Sample care tasks for newborn puppy
      const initialCareTasks = [
        {
          puppy_id: puppyId,
          milestone_type: 'health_check',
          title: 'First health check',
          expected_age_days: 1,
          milestone_date: today.toISOString(),
        },
        {
          puppy_id: puppyId,
          milestone_type: 'weight',
          title: 'Weight check in 12 hours',
          expected_age_days: 1,
          milestone_date: new Date(today.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          puppy_id: puppyId,
          milestone_type: 'feeding',
          title: 'Check nursing',
          expected_age_days: 1,
          milestone_date: new Date(today.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        }
      ];
      
      // Insert milestones
      await supabase
        .from('puppy_milestones')
        .insert(initialCareTasks);
        
    } catch (error) {
      console.error('Error initializing care tracking:', error);
    }
  };
  
  const finishRegistration = () => {
    if (puppiesRegistered.length === 0) {
      toast({
        title: "No Puppies Added",
        description: "Please register at least one puppy.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Registration Complete",
      description: `${puppiesRegistered.length} puppies have been registered.`,
    });
    
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Register New Puppy</CardTitle>
          {litterInfo && (
            <div className="text-sm text-muted-foreground">
              Litter: {litterInfo.litterName || 'Unnamed Litter'} 
              <br />
              Dam: {litterInfo.damName || 'Unknown'} 
              <br />
              Sire: {litterInfo.sireName || 'Unknown'}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Puppy Name/ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birth_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="markings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Markings</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="birth_weight"
                render={({ field }) => (
                  <WeightInput 
                    form={form} 
                    name="birth_weight" 
                    label="Birth Weight" 
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
                        placeholder="Any additional notes about this puppy"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={finishRegistration}
                  disabled={isSubmitting || puppiesRegistered.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Complete Registration
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Puppy
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {puppiesRegistered.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registered Puppies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {puppiesRegistered.map((puppy, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <span className="font-medium">{puppy.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {puppy.gender}, {puppy.color} 
                      {puppy.markings && ` (${puppy.markings})`}
                    </span>
                  </div>
                  <div className="text-sm">
                    Birth Weight: {puppy.birth_weight} {puppy.weight_unit}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PuppyRegistrationForm;
