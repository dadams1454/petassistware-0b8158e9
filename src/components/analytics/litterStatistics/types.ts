
export interface LitterStatisticsProps {
  puppies: Puppy[];
  title?: string;
}

export interface PuppyStatistics {
  totalPuppies: number;
  puppiesWithWeightData: number;
  avgBirthWeight: string;
  avgCurrentWeight: string;
  avgWeightGain: string;
  avgWeightGainPercent: string;
  puppiesWithVaccinations: number;
  puppiesWithDeworming: number;
  puppiesWithVetChecks: number;
  vaccinationPercentage: number;
  dewormingPercentage: number;
  vetChecksPercentage: number;
}
