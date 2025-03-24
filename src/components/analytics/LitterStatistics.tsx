import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertTriangle, Info } from 'lucide-react';

interface LitterStatisticsProps {
  puppies: Puppy[];
  title?: string;
}

const LitterStatistics: React.FC<LitterStatisticsProps> = ({ 
  puppies,
  title = "Litter Statistics"
}) => {
  const stats = useMemo(() => {
    // Filter puppies with weight data
    const puppiesWithWeight = puppies.filter(p => p.current_weight && p.birth_weight);
    
    // Calculate average weights
    const avgBirthWeight = puppiesWithWeight.length > 0 
      ? puppiesWithWeight.reduce((sum, p) => {
          const weight = typeof p.birth_weight === 'string' 
            ? parseFloat(p.birth_weight || '0') 
            : p.birth_weight || 0;
          return sum + weight;
        }, 0) / puppiesWithWeight.length
      : 0;
    
    const avgCurrentWeight = puppiesWithWeight.length > 0 
      ? puppiesWithWeight.reduce((sum, p) => {
          const weight = typeof p.current_weight === 'string' 
            ? parseFloat(p.current_weight || '0') 
            : p.current_weight || 0;
          return sum + weight;
        }, 0) / puppiesWithWeight.length
      : 0;
    
    // Calculate weight gain
    const avgWeightGain = avgCurrentWeight - avgBirthWeight;
    const avgWeightGainPercent = avgBirthWeight > 0 
      ? (avgWeightGain / avgBirthWeight) * 100 
      : 0;

    // Health records
    const puppiesWithVaccinations = puppies.filter(p => p.vaccination_dates).length;
    const puppiesWithDeworming = puppies.filter(p => p.deworming_dates).length;
    const puppiesWithVetChecks = puppies.filter(p => p.vet_check_dates).length;

    // Calculate percentages
    const vaccinationPercentage = (puppiesWithVaccinations / puppies.length) * 100;
    const dewormingPercentage = (puppiesWithDeworming / puppies.length) * 100;
    const vetChecksPercentage = (puppiesWithVetChecks / puppies.length) * 100;
    
    return {
      totalPuppies: puppies.length,
      puppiesWithWeightData: puppiesWithWeight.length,
      avgBirthWeight: avgBirthWeight.toFixed(1),
      avgCurrentWeight: avgCurrentWeight.toFixed(1),
      avgWeightGain: avgWeightGain.toFixed(1),
      avgWeightGainPercent: avgWeightGainPercent.toFixed(0),
      puppiesWithVaccinations,
      puppiesWithDeworming,
      puppiesWithVetChecks,
      vaccinationPercentage,
      dewormingPercentage,
      vetChecksPercentage
    };
  }, [puppies]);

  if (puppies.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 border border-dashed rounded-md">
            <div className="text-center">
              <Info className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No puppy data available for statistics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Weight Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Average Birth Weight</p>
              <p className="text-lg font-semibold">{stats.avgBirthWeight} oz</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Average Current Weight</p>
              <p className="text-lg font-semibold">{stats.avgCurrentWeight} oz</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Average Weight Gain</p>
              <p className="text-lg font-semibold">{stats.avgWeightGain} oz</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Weight Gain %</p>
              <p className="text-lg font-semibold">{stats.avgWeightGainPercent}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Health Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center gap-2">
                {stats.vaccinationPercentage === 100 ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : stats.vaccinationPercentage > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Info className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm">Vaccinations</span>
              </div>
              <div className="text-sm font-medium">
                {stats.puppiesWithVaccinations} of {stats.totalPuppies} ({Math.round(stats.vaccinationPercentage)}%)
              </div>
            </div>
            
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center gap-2">
                {stats.dewormingPercentage === 100 ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : stats.dewormingPercentage > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Info className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm">Deworming</span>
              </div>
              <div className="text-sm font-medium">
                {stats.puppiesWithDeworming} of {stats.totalPuppies} ({Math.round(stats.dewormingPercentage)}%)
              </div>
            </div>
            
            <div className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center gap-2">
                {stats.vetChecksPercentage === 100 ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : stats.vetChecksPercentage > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Info className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm">Vet Checks</span>
              </div>
              <div className="text-sm font-medium">
                {stats.puppiesWithVetChecks} of {stats.totalPuppies} ({Math.round(stats.vetChecksPercentage)}%)
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LitterStatistics;
