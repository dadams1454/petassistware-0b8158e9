
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewDogFormInputs {
  name: string;
  breed?: string;
  gender: string;
  birthdate?: string;
  color?: string;
  weight?: number;
  weight_unit?: string;
  microchip_number?: string;
  registration_number?: string;
  notes?: string;
}

const NewDogPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<NewDogFormInputs>();

  const createDogMutation = useMutation({
    mutationFn: async (data: NewDogFormInputs) => {
      const { data: newDog, error } = await supabase
        .from('dogs')
        .insert([{
          name: data.name,
          breed: data.breed,
          gender: data.gender,
          birthdate: data.birthdate,
          color: data.color,
          weight: data.weight,
          weight_unit: data.weight_unit || 'lbs',
          microchip_number: data.microchip_number,
          registration_number: data.registration_number,
          notes: data.notes,
          status: 'active',
        }])
        .select()
        .single();
      
      if (error) throw error;
      return newDog;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast({
        title: 'Success',
        description: `Dog ${data.name} was created successfully.`,
      });
      navigate(`/dogs/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating dog',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const onSubmit: SubmitHandler<NewDogFormInputs> = async (data) => {
    createDogMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/dogs">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dogs
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Dog</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Dog Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input id="breed" {...register('breed')} />
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setValue('gender', value)} defaultValue="">
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('gender', { required: 'Gender is required' })} />
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input id="birthdate" type="date" {...register('birthdate')} />
                </div>
                
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" {...register('color')} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input id="weight" type="number" step="0.1" {...register('weight', { valueAsNumber: true })} />
                  </div>
                  
                  <div>
                    <Label htmlFor="weight_unit">Weight Unit</Label>
                    <Select onValueChange={(value) => setValue('weight_unit', value)} defaultValue="lbs">
                      <SelectTrigger id="weight_unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('weight_unit')} value={watch('weight_unit') || 'lbs'} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="microchip_number">Microchip Number</Label>
                  <Input id="microchip_number" {...register('microchip_number')} />
                </div>
                
                <div>
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input id="registration_number" {...register('registration_number')} />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" {...register('notes')} />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/dogs')}>Cancel</Button>
              <Button type="submit" disabled={createDogMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {createDogMutation.isPending ? 'Saving...' : 'Save Dog'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewDogPage;
