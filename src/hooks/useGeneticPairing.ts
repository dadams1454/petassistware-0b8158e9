
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ColorProbability, 
  HealthSummary,
  DogGenotype
} from '@/types/genetics';
import { 
  calculateColorProbabilities,
  calculateHealthRisks,
  calculateInbreedingCoefficient
} from '@/components/genetics/utils/geneticCalculations';

interface GeneticPairingData {
  hasData: boolean;
  isLoading: boolean;
  error: Error | null;
  sireGenotype: DogGenotype | null;
  damGenotype: DogGenotype | null;
  colorProbabilities: ColorProbability[];
  healthRisks: Record<string, { status: string; probability: number }>;
  inbreedingCoefficient: number;
  compatibilityScore: number;
  healthConcernCounts: {
    atRisk: number;
    carrier: number;
    clear: number;
    unknown: number;
  };
  healthSummary: HealthSummary;
  recommendations: string[];
}

export const useGeneticPairing = (sireId: string, damId: string): GeneticPairingData => {
  const [geneticData, setGeneticData] = useState<GeneticPairingData>({
    hasData: false,
    isLoading: true,
    error: null,
    sireGenotype: null,
    damGenotype: null,
    colorProbabilities: [],
    healthRisks: {},
    inbreedingCoefficient: 0,
    compatibilityScore: 0,
    healthConcernCounts: {
      atRisk: 0,
      carrier: 0,
      clear: 0,
      unknown: 0
    },
    healthSummary: {
      atRiskCount: 0,
      carrierCount: 0,
      clearCount: 0,
      unknownCount: 0,
      totalTests: 0
    },
    recommendations: []
  });

  // Fetch genetic data for both dogs
  const { data: geneticDataFetched, isLoading, error } = useQuery({
    queryKey: ['genetic-data', sireId, damId],
    queryFn: async () => {
      if (!sireId || !damId) {
        return { sireGenotype: null, damGenotype: null };
      }

      const { data: sireData, error: sireError } = await supabase
        .from('genetic_data')
        .select('*')
        .eq('dog_id', sireId)
        .single();

      const { data: damData, error: damError } = await supabase
        .from('genetic_data')
        .select('*')
        .eq('dog_id', damId)
        .single();

      if (sireError) {
        console.error('Error fetching sire genetic data:', sireError);
      }

      if (damError) {
        console.error('Error fetching dam genetic data:', damError);
      }

      // Convert the data to our DogGenotype type
      const sireGenotype = sireData ? {
        dog_id: sireId,
        id: sireData.id,
        baseColor: sireData.base_color || 'unknown',
        brownDilution: sireData.brown_dilution || 'unknown',
        dilution: sireData.dilution || 'unknown',
        agouti: sireData.agouti || 'unknown',
        healthMarkers: sireData.health_markers || {},
        updated_at: sireData.updated_at
      } as DogGenotype : null;

      const damGenotype = damData ? {
        dog_id: damId,
        id: damData.id,
        baseColor: damData.base_color || 'unknown',
        brownDilution: damData.brown_dilution || 'unknown',
        dilution: damData.dilution || 'unknown',
        agouti: damData.agouti || 'unknown',
        healthMarkers: damData.health_markers || {},
        updated_at: damData.updated_at
      } as DogGenotype : null;

      return { sireGenotype, damGenotype };
    },
    enabled: Boolean(sireId) && Boolean(damId),
  });

  useEffect(() => {
    if (isLoading || error || !geneticDataFetched) {
      // Still loading or error occurred
      setGeneticData(prev => ({
        ...prev,
        isLoading,
        error: error as Error | null,
        hasData: false
      }));
      return;
    }

    const { sireGenotype, damGenotype } = geneticDataFetched;
    
    // If we don't have both genotypes, we can't calculate compatibility
    if (!sireGenotype || !damGenotype) {
      setGeneticData(prev => ({
        ...prev,
        isLoading: false,
        hasData: false,
        sireGenotype,
        damGenotype
      }));
      return;
    }

    // Calculate genetic compatibility
    const colorProbabilities = calculateColorProbabilities(sireGenotype, damGenotype);
    const healthRisks = calculateHealthRisks(sireGenotype, damGenotype);
    const inbreedingCoefficient = calculateInbreedingCoefficient(sireGenotype, damGenotype);
    
    // Calculate health concern counts
    const healthConcernCounts = {
      atRisk: 0,
      carrier: 0,
      clear: 0,
      unknown: 0
    };

    Object.values(healthRisks).forEach(risk => {
      if (risk.status === 'at_risk' || risk.status === 'affected') {
        healthConcernCounts.atRisk++;
      } else if (risk.status === 'carrier') {
        healthConcernCounts.carrier++;
      } else if (risk.status === 'clear') {
        healthConcernCounts.clear++;
      } else {
        healthConcernCounts.unknown++;
      }
    });

    // Calculate compatibility score (simple version)
    let compatibilityScore = 100;
    
    // Reduce score for each at-risk condition
    compatibilityScore -= healthConcernCounts.atRisk * 20;
    
    // Reduce score for each carrier condition (but less than at-risk)
    compatibilityScore -= healthConcernCounts.carrier * 5;
    
    // Reduce score for inbreeding coefficient
    compatibilityScore -= Math.round(inbreedingCoefficient * 100);
    
    // Ensure score is between 0 and 100
    compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));

    // Create health summary
    const healthSummary: HealthSummary = {
      atRiskCount: healthConcernCounts.atRisk,
      carrierCount: healthConcernCounts.carrier,
      clearCount: healthConcernCounts.clear,
      unknownCount: healthConcernCounts.unknown,
      totalTests: Object.keys(healthRisks).length
    };

    // Generate recommendations
    const recommendations: string[] = [];
    if (healthConcernCounts.atRisk > 0) {
      recommendations.push('Consider genetic counseling before breeding this pair.');
    }
    if (inbreedingCoefficient > 0.125) {
      recommendations.push('High inbreeding coefficient detected. Consider a different pairing to maintain genetic diversity.');
    }
    if (healthConcernCounts.carrier > 0) {
      recommendations.push('Carrier status detected for some conditions. Monitor offspring for these traits.');
    }

    setGeneticData({
      hasData: true,
      isLoading: false,
      error: null,
      sireGenotype,
      damGenotype,
      colorProbabilities,
      healthRisks,
      inbreedingCoefficient,
      compatibilityScore,
      healthConcernCounts,
      healthSummary,
      recommendations
    });
  }, [isLoading, error, geneticDataFetched, sireId, damId]);

  return geneticData;
};
