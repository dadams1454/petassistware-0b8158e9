
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  ColorProbability, 
  DogGenotype,
  HealthRisk
} from '@/types/genetics';
import { calculateColorProbabilities, calculateHealthRisks } from '@/components/genetics/utils/geneticCalculations';

interface GeneticPairingResult {
  colorProbabilities: ColorProbability[];
  healthRisks: Record<string, HealthRisk>;
  inbreedingCoefficient: number;
}

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
        // Fetch sire genotype
        const { data: sireData, error: sireError } = await supabase
          .from('dog_genotypes')
          .select('*')
          .eq('dog_id', sireId)
          .single();
          
        if (sireError) throw new Error(`Failed to fetch sire genetics: ${sireError.message}`);
        
        // Fetch dam genotype
        const { data: damData, error: damError } = await supabase
          .from('dog_genotypes')
          .select('*')
          .eq('dog_id', damId)
          .single();
          
        if (damError) throw new Error(`Failed to fetch dam genetics: ${damError.message}`);
        
        // Fetch dog names for display
        const { data: sireInfo, error: sireInfoError } = await supabase
          .from('dogs')
          .select('name, breed')
          .eq('id', sireId)
          .single();
          
        if (sireInfoError) console.error("Error fetching sire info:", sireInfoError);
        
        const { data: damInfo, error: damInfoError } = await supabase
          .from('dogs')
          .select('name, breed')
          .eq('id', damId)
          .single();
          
        if (damInfoError) console.error("Error fetching dam info:", damInfoError);
        
        // Map database fields to our genotype structure
        const sireGenotype: DogGenotype = {
          id: sireData.id,
          dog_id: sireData.dog_id,
          baseColor: sireData.base_color || 'unknown',
          brownDilution: sireData.brown_dilution || 'unknown',
          dilution: sireData.dilution || 'unknown',
          agouti: sireData.agouti || 'unknown',
          healthMarkers: sireData.health_markers || {},
          updated_at: sireData.updated_at,
          name: sireInfo?.name,
          breed: sireInfo?.breed
        };
        
        const damGenotype: DogGenotype = {
          id: damData.id,
          dog_id: damData.dog_id,
          baseColor: damData.base_color || 'unknown',
          brownDilution: damData.brown_dilution || 'unknown',
          dilution: damData.dilution || 'unknown',
          agouti: damData.agouti || 'unknown',
          healthMarkers: damData.health_markers || {},
          updated_at: damData.updated_at,
          name: damInfo?.name,
          breed: damInfo?.breed
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
