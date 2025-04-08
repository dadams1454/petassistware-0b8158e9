
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  ColorProbability, 
  DogGenotype,
  HealthRisk
} from '@/types/genetics';
import { calculateColorProbabilities, calculateHealthRisks } from '@/components/genetics/utils/geneticCalculations';

export function useGeneticPairing(sireId: string, damId: string) {
  const [sireGenotype, setSireGenotype] = useState<DogGenotype | null>(null);
  const [damGenotype, setDamGenotype] = useState<DogGenotype | null>(null);
  const [colorProbabilities, setColorProbabilities] = useState<ColorProbability[]>([]);
  const [healthRisks, setHealthRisks] = useState<Record<string, HealthRisk>>({});
  const [inbreedingCoefficient, setInbreedingCoefficient] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDogGenotypes = async () => {
      if (!sireId || !damId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // This is a placeholder for the actual database fetch
        // In a real implementation, we would fetch from dog_genotypes table
        
        // Fetch sire data to create a genotype
        const { data: sireData, error: sireError } = await supabase
          .from('dogs')
          .select('id, name, breed, color')
          .eq('id', sireId)
          .single();
          
        if (sireError) throw new Error(`Failed to fetch sire data: ${sireError.message}`);
        
        // Fetch dam data to create a genotype
        const { data: damData, error: damError } = await supabase
          .from('dogs')
          .select('id, name, breed, color')
          .eq('id', damId)
          .single();
          
        if (damError) throw new Error(`Failed to fetch dam data: ${damError.message}`);
        
        // Create placeholder genotypes until we have real genetic data
        const sireGenotype: DogGenotype = {
          dog_id: sireId,
          baseColor: sireData.color || 'unknown',
          brownDilution: 'unknown',
          dilution: 'unknown',
          agouti: 'unknown',
          healthMarkers: {},
          updated_at: new Date().toISOString(),
          name: sireData.name,
          breed: sireData.breed
        };
        
        const damGenotype: DogGenotype = {
          dog_id: damId,
          baseColor: damData.color || 'unknown',
          brownDilution: 'unknown',
          dilution: 'unknown',
          agouti: 'unknown',
          healthMarkers: {},
          updated_at: new Date().toISOString(),
          name: damData.name,
          breed: damData.breed
        };
        
        setSireGenotype(sireGenotype);
        setDamGenotype(damGenotype);
        
        // Calculate genetic compatibility metrics
        const colorProbs = calculateColorProbabilities(sireGenotype, damGenotype);
        const healthRisks = calculateHealthRisks(sireGenotype, damGenotype);
        // For a real implementation, this would use a proper algorithm
        const inbreedingCoef = 0.0625; // Placeholder value, ~equivalent to first cousins
        
        setColorProbabilities(colorProbs);
        setHealthRisks(healthRisks);
        setInbreedingCoefficient(inbreedingCoef);
        
      } catch (err) {
        console.error("Error in genetic pairing:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast({
          title: 'Error fetching genetic data',
          description: err instanceof Error ? err.message : 'Could not retrieve genetic information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDogGenotypes();
  }, [sireId, damId, toast]);
  
  return {
    sireGenotype,
    damGenotype,
    colorProbabilities,
    healthRisks,
    inbreedingCoefficient,
    isLoading,
    error
  };
}
