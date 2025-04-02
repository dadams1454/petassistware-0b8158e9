
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDogProfileData } from '@/hooks/useDogProfileData';

interface EditDogFormInputs {
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
  status: string;
  pedigree?: boolean;
  is_pregnant?: boolean;
}

const EditDogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { dog, isLoading, error } = useDogProfileData(id);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<EditDogFormInputs>();

  // Set form values when dog data is loaded
  useEffect(() => {
    if (dog) {
      reset({
        name: dog.name,
        breed: dog.breed,
        gender: dog.gender,
        birthdate: dog.birthdate,
        color: dog.color,
        weight: dog.weight,
        weight_unit: dog.weight_unit,
        microchip_number: dog.microchip_number,
        registration_number: dog.registration_number,
        notes: dog.notes,
        status: dog.status || 'active',
        pedigree: dog.pedigree,
        is_pregnant: dog.is_pregnant,
      });
    }
  }, [dog, reset]);

  const updateDogMutation = useMutation({
    mutationFn: async (data: EditDogFormInputs) => {
      const { data: updatedDog, error } = await supabase
        .from('dogs')
        .update({
          name: data.name,
          breed: data.breed,
          gender: data.gender,
          birthdate: data.birthdate,
          color: data.color,
          weight: data.weight,
          weight_unit: data.weight_unit,
          microchip_number: data.microchip_number,
          registration_number: data.registration_number,
          notes: data.notes,
          status: data.status,
          pedigree: data.pedigree,
          is_pregnant: data.is_pregnant,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedDog;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dog', id] });
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast({
        title: 'Success',
        description: `Dog ${data.name} was updated successfully.`,
      });
      navigate(`/dogs/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating dog',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const onSubmit: SubmitHandler<EditDogFormInputs> = (data) => {
    updateDogMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading dog data...</div>;
  }

  if (error || !dog) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h1 className="text-xl font-bold text-red-700">Error loading dog</h1>
          <p className="text-red-600">{error?.message || "Dog not found"}</p>
          <Link to="/dogs">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to={`/dogs/${id}`}>
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dog Profile
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Dog: {dog.name}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Dog Details</CardTitle>
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
                  <Select 
                    onValueChange={(value) => setValue('gender', value)} 
                    defaultValue={dog.gender}
                    value={watch('gender')}
                  >
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

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    onValueChange={(value) => setValue('status', value)} 
                    defaultValue={dog.status || 'active'}
                    value={watch('status')}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="deceased">Deceased</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('status')} />
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
                    <Select 
                      onValueChange={(value) => setValue('weight_unit', value)} 
                      defaultValue={dog.weight_unit || 'lbs'}
                      value={watch('weight_unit')}
                    >
                      <SelectTrigger id="weight_unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register('weight_unit')} />
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
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="pedigree" 
                    checked={watch('pedigree')} 
                    onCheckedChange={(checked) => setValue('pedigree', checked)} 
                  />
                  <Label htmlFor="pedigree">Has Pedigree</Label>
                  <input type="hidden" {...register('pedigree')} />
                </div>
                
                {watch('gender') === 'Female' && (
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="is_pregnant" 
                      checked={watch('is_pregnant')} 
                      onCheckedChange={(checked) => setValue('is_pregnant', checked)} 
                    />
                    <Label htmlFor="is_pregnant">Currently Pregnant</Label>
                    <input type="hidden" {...register('is_pregnant')} />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register('notes')} />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/dogs/${id}`)}>Cancel</Button>
              <Button type="submit" disabled={updateDogMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateDogMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDogPage;
