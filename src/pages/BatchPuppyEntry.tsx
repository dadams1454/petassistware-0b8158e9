
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface PuppyEntry {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_weight: string;
  weight_unit: 'oz' | 'g';
  notes: string;
}

const BatchPuppyEntry = () => {
  const { litterId } = useParams<{ litterId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [litterInfo, setLitterInfo] = useState<any>(null);
  const [puppyEntries, setPuppyEntries] = useState<PuppyEntry[]>([
    {
      id: crypto.randomUUID(),
      name: 'Puppy 1',
      gender: 'Male',
      color: '',
      birth_weight: '',
      weight_unit: 'oz',
      notes: '',
    },
  ]);

  React.useEffect(() => {
    if (litterId) {
      fetchLitterInfo();
    }
  }, [litterId]);

  const fetchLitterInfo = async () => {
    try {
      const { data: litter, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(id, name),
          sire:sire_id(id, name)
        `)
        .eq('id', litterId)
        .single();

      if (error) throw error;
      setLitterInfo(litter);
    } catch (error) {
      console.error('Error fetching litter:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch litter information',
        variant: 'destructive',
      });
    }
  };

  const addNewPuppy = () => {
    setPuppyEntries([
      ...puppyEntries,
      {
        id: crypto.randomUUID(),
        name: `Puppy ${puppyEntries.length + 1}`,
        gender: 'Male',
        color: '',
        birth_weight: '',
        weight_unit: 'oz',
        notes: '',
      },
    ]);
  };

  const removePuppy = (id: string) => {
    if (puppyEntries.length > 1) {
      setPuppyEntries(puppyEntries.filter(puppy => puppy.id !== id));
    } else {
      toast({
        title: 'Cannot Remove',
        description: 'You must have at least one puppy entry',
      });
    }
  };

  const updatePuppyField = (id: string, field: keyof PuppyEntry, value: any) => {
    setPuppyEntries(
      puppyEntries.map(puppy => (puppy.id === id ? { ...puppy, [field]: value } : puppy))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate entries
      const invalidEntries = puppyEntries.filter(
        puppy => !puppy.name || !puppy.gender || !puppy.color || !puppy.birth_weight
      );

      if (invalidEntries.length > 0) {
        throw new Error('Please fill in all required fields for each puppy');
      }

      // Prepare puppy data for insertion
      const puppyData = puppyEntries.map((puppy, index) => ({
        name: puppy.name,
        gender: puppy.gender,
        color: puppy.color,
        birth_weight: puppy.birth_weight,
        weight_unit: puppy.weight_unit,
        notes: puppy.notes,
        litter_id: litterId,
        birth_date: new Date().toISOString().split('T')[0],
        birth_order: index + 1,
        status: 'Available',
        is_test_data: isTestMode,
      }));

      // Insert all puppies in a batch
      const { data, error } = await supabase.from('puppies').insert(puppyData).select();

      if (error) throw error;

      // Create initial weight records for each puppy
      const weightRecords = data.map(puppy => ({
        puppy_id: puppy.id,
        weight: parseFloat(puppy.birth_weight),
        weight_unit: puppy.weight_unit,
        date: new Date().toISOString().split('T')[0],
        notes: 'Initial birth weight',
      }));

      // Insert weight records
      const { error: weightError } = await supabase.from('weight_records').insert(weightRecords);

      if (weightError) throw weightError;

      // Update the litter with puppy counts
      const maleCount = puppyEntries.filter(puppy => puppy.gender === 'Male').length;
      const femaleCount = puppyEntries.filter(puppy => puppy.gender === 'Female').length;

      const { error: litterError } = await supabase
        .from('litters')
        .update({
          male_count: maleCount,
          female_count: femaleCount,
          puppy_count: puppyEntries.length,
          status: 'active',
        })
        .eq('id', litterId);

      if (litterError) throw litterError;

      toast({
        title: 'Success!',
        description: `${puppyEntries.length} puppies have been added to the litter`,
      });

      // Navigate to the litter detail page
      navigate(`/litters/${litterId}`);
    } catch (error: any) {
      console.error('Error adding puppies:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add puppies',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Add New Puppies</h1>
          <p className="text-muted-foreground">
            Batch add puppies to {litterInfo?.litter_name || 'the litter'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={isTestMode ? "text-amber-500 font-medium" : "text-muted-foreground"}>
            Test Mode
          </span>
          <Switch 
            checked={isTestMode} 
            onCheckedChange={setIsTestMode} 
            className={isTestMode ? "bg-amber-500" : ""}
          />
          {isTestMode && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              TEST DATA
            </Badge>
          )}
        </div>
      </div>

      {litterInfo && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Dam:</h3>
                <p>{litterInfo.dam?.name || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-medium">Sire:</h3>
                <p>{litterInfo.sire?.name || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-medium">Birth Date:</h3>
                <p>{new Date(litterInfo.birth_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Litter Name:</h3>
                <p>{litterInfo.litter_name || 'Unnamed Litter'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {puppyEntries.map((puppy, index) => (
            <Card key={puppy.id} className={index % 2 === 0 ? "border-blue-200" : "border-pink-200"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Puppy #{index + 1} 
                    <Badge 
                      variant="outline" 
                      className={puppy.gender === 'Male' ? "ml-2 bg-blue-100 text-blue-800 border-blue-300" : "ml-2 bg-pink-100 text-pink-800 border-pink-300"}
                    >
                      {puppy.gender}
                    </Badge>
                  </CardTitle>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => removePuppy(puppy.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${puppy.id}`}>Name/ID</Label>
                    <Input
                      id={`name-${puppy.id}`}
                      value={puppy.name}
                      onChange={e => updatePuppyField(puppy.id, 'name', e.target.value)}
                      placeholder="Puppy name or ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gender-${puppy.id}`}>Gender</Label>
                    <Select
                      value={puppy.gender}
                      onValueChange={value => updatePuppyField(puppy.id, 'gender', value as 'Male' | 'Female')}
                    >
                      <SelectTrigger id={`gender-${puppy.id}`}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`color-${puppy.id}`}>Color/Markings</Label>
                    <Input
                      id={`color-${puppy.id}`}
                      value={puppy.color}
                      onChange={e => updatePuppyField(puppy.id, 'color', e.target.value)}
                      placeholder="Color and markings"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor={`weight-${puppy.id}`}>Birth Weight</Label>
                      <Input
                        id={`weight-${puppy.id}`}
                        value={puppy.birth_weight}
                        onChange={e => updatePuppyField(puppy.id, 'birth_weight', e.target.value)}
                        placeholder="Birth weight"
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`unit-${puppy.id}`}>Unit</Label>
                      <Select
                        value={puppy.weight_unit}
                        onValueChange={value => updatePuppyField(puppy.id, 'weight_unit', value as 'oz' | 'g')}
                      >
                        <SelectTrigger id={`unit-${puppy.id}`}>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oz">oz</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`notes-${puppy.id}`}>Notes</Label>
                    <Textarea
                      id={`notes-${puppy.id}`}
                      value={puppy.notes}
                      onChange={e => updatePuppyField(puppy.id, 'notes', e.target.value)}
                      placeholder="Additional notes"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            type="button" 
            variant="outline" 
            onClick={addNewPuppy} 
            className="w-full flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add Another Puppy
          </Button>

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/litters/${litterId}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save All Puppies'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BatchPuppyEntry;
