
export interface WeightData {
  name: string;
  weight: number;
  birthWeight: number;
  litterAverage?: number;
  color: string | null;
  id?: string;
  gender?: string;
}

export interface PuppyWeightChartProps {
  puppies: Puppy[];
  title?: string;
}
