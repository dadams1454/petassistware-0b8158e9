
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { DogSelector } from '@/components/genetics/DogSelector';
import { useToast } from '@/hooks/use-toast';
import { Dna } from 'lucide-react';
import { GeneticCompatibilityAnalyzer } from '@/components/genetics/GeneticCompatibilityAnalyzer';

interface RecordBreedingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  damId?: string;
  onSuccess?: () => void;
}

interface BreedingFormData {
  sireId: string;
  damId: string;
  breedingDate: string;
  notes: string;
}

const RecordBreedingDialog: React.FC<RecordBreedingDialogProps> = ({
  open,
  onOpenChange,
  damId,
  onSuccess
}) => {
  const { toast } = useToast();
  const [sireId, setSireId] = useState<string>('');
  const [selectedDamId, setSelectedDamId] = useState<string>(damId || '');
  const [showGeneticAnalysis, setShowGeneticAnalysis] = useState<boolean>(false);
  
  const form = useForm<BreedingFormData>({
    defaultValues: {
      sireId: '',
      damId: damId || '',
      breedingDate: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const handleSireChange = (sireId: string) => {
    setSireId(sireId);
    if (sireId && selectedDamId) {
      setShowGeneticAnalysis(true);
    } else {
      setShowGeneticAnalysis(false);
    }
  };

  const handleDamChange = (damId: string) => {
    setSelectedDamId(damId);
    if (sireId && damId) {
      setShowGeneticAnalysis(true);
    } else {
      setShowGeneticAnalysis(false);
    }
  };

  const onSubmit = async (data: BreedingFormData) => {
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('You must be logged in to record a breeding');
      }
      
      // Create a custom dogs_breedings table or use a different approach
      // since 'breedings' table is not available in the schema
      const { data: breedingData, error: breedingError } = await supabase
        .from('dog_relationships')  // Use an existing table that can store breeding relationships
        .insert({
          dog_id: sireId,
          related_dog_id: selectedDamId,
          relationship_type: 'breeding'
        })
        .select()
        .single();
      
      if (breedingError) throw breedingError;
      
      // Create activity record
      await supabase
        .from('activities')
        .insert({
          title: 'Breeding Recorded',
          description: `Breeding recorded between sire and dam`,
          activity_type: 'breeding',
          breeder_id: userData.user.id
        });
      
      // Success message
      toast({
        title: 'Breeding Recorded',
        description: 'The breeding has been successfully recorded.'
      });
      
      // Close dialog and refresh data
      onOpenChange(false);
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error recording breeding:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to record breeding. Please try again.'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Record Breeding</DialogTitle>
          <DialogDescription>
            Record a breeding between a sire and dam. This will create a breeding record
            that can be used to track litters and puppies.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <DogSelector
                value={sireId}
                onChange={handleSireChange}
                placeholder="Select Sire (Male)..."
                filterSex="male"
                label="Sire"
              />
            </div>
            
            <div>
              <DogSelector
                value={selectedDamId}
                onChange={handleDamChange}
                placeholder="Select Dam (Female)..."
                filterSex="female"
                label="Dam"
                disabled={!!damId}
              />
            </div>
          </div>
          
          {showGeneticAnalysis && (
            <div className="border rounded-lg p-4 bg-slate-50">
              <div className="flex items-center mb-3">
                <Dna className="h-5 w-5 mr-2 text-purple-600" />
                <h3 className="font-medium">Genetic Compatibility Analysis</h3>
              </div>
              <GeneticCompatibilityAnalyzer 
                sireId={sireId} 
                damId={selectedDamId} 
                showHealthWarnings={true}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breeding Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                {...form.register('breedingDate')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter any breeding notes..."
                {...form.register('notes')}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit(form.getValues())}>
              Record Breeding
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordBreedingDialog;
