
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Heart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { customSupabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import GeneticCompatibilityAnalyzer from '@/components/genetics/GeneticCompatibilityAnalyzer';

interface RecordBreedingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dog: any;
  onSuccess: () => void;
}

const RecordBreedingDialog: React.FC<RecordBreedingDialogProps> = ({ 
  isOpen,
  onClose,
  dog,
  onSuccess
}) => {
  const [matingDate, setMatingDate] = useState<Date | undefined>(new Date());
  const [sireId, setSireId] = useState<string>('');
  const [sireOptions, setSireOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSire, setSelectedSire] = useState<any>(null);
  const { toast } = useToast();
  
  React.useEffect(() => {
    const fetchSires = async () => {
      try {
        const { data, error } = await customSupabase
          .from('dogs')
          .select('id, name, breed, photo_url')
          .eq('gender', 'Male')
          .order('name');
          
        if (error) throw error;
        setSireOptions(data || []);
      } catch (error) {
        console.error('Error fetching sires:', error);
      }
    };
    
    if (isOpen) {
      fetchSires();
    }
  }, [isOpen]);
  
  const handleSireChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSireId(id);
    setSelectedSire(sireOptions.find(sire => sire.id === id));
  };
  
  const handleSubmit = async () => {
    if (!matingDate || !sireId) {
      toast({
        title: "Missing Information",
        description: "Please select both a sire and mating date",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update the female dog to be pregnant and record the tie date
      const { error: dogUpdateError } = await customSupabase
        .from('dogs')
        .update({
          is_pregnant: true,
          tie_date: format(matingDate, 'yyyy-MM-dd')
        })
        .eq('id', dog.id);
        
      if (dogUpdateError) throw dogUpdateError;
      
      // Create a new litter entry (pending birth)
      const { error: litterError } = await customSupabase
        .from('litters')
        .insert({
          dam_id: dog.id,
          sire_id: sireId,
          status: 'pending', // Pending until birth is recorded
          first_mating_date: format(matingDate, 'yyyy-MM-dd'),
          last_mating_date: format(matingDate, 'yyyy-MM-dd'),
          breeder_id: (await customSupabase.auth.getUser()).data.user?.id
        });
      
      if (litterError) throw litterError;
      
      toast({
        title: "Breeding Recorded",
        description: `Breeding between ${dog.name} and selected sire has been recorded`
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error recording breeding:', error);
      toast({
        title: "Error",
        description: "Failed to record breeding information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" /> 
            Record Breeding for {dog.name}
          </DialogTitle>
          <DialogDescription>
            Record a breeding event to track pregnancy and upcoming litter
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sire">Select Sire (Male)</Label>
            <select
              id="sire"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={sireId}
              onChange={handleSireChange}
            >
              <option value="">Select a sire...</option>
              {sireOptions.map(sire => (
                <option key={sire.id} value={sire.id}>
                  {sire.name} ({sire.breed})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Mating Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !matingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {matingDate ? format(matingDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={matingDate}
                  onSelect={setMatingDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Genetic Compatibility Analysis */}
          {selectedSire && (
            <div className="border rounded-md p-3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center">
                  <Dna className="h-4 w-4 mr-1 text-indigo-500" />
                  Genetic Compatibility
                </h4>
                <Badge variant="outline" className="text-xs">
                  Preview
                </Badge>
              </div>
              
              <GeneticCompatibilityAnalyzer 
                sireId={selectedSire.id}
                damId={dog.id}
                showProbabilities={false}
                showHealthWarnings={true}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Record Breeding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordBreedingDialog;
