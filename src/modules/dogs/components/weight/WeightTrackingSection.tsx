
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WeightRecord } from '../../types/dog';
import { format } from 'date-fns';

interface WeightTrackingSectionProps {
  dogId: string;
  weightHistory: WeightRecord[];
  growthStats: {
    percentChange: number;
    averageGrowthRate: number;
    projectedWeight: number | null;
    weightGoal: number | null;
    onTrack: boolean | null;
  } | null;
  onAddWeight: () => void;
  onDeleteWeight?: (id: string) => void;
  isLoading: boolean;
}

const WeightTrackingSection: React.FC<WeightTrackingSectionProps> = ({
  dogId,
  weightHistory,
  growthStats,
  onAddWeight,
  onDeleteWeight,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Weight Records</h3>
        <Button onClick={onAddWeight} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Weight
        </Button>
      </div>

      {weightHistory.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No weight records yet.</p>
          <Button onClick={onAddWeight} variant="outline" className="mt-2">
            Add First Weight Record
          </Button>
        </div>
      ) : (
        <>
          {growthStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Recent Change
                  </div>
                  <div className="text-2xl font-bold">
                    {growthStats.percentChange.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Growth Rate
                  </div>
                  <div className="text-2xl font-bold">
                    {growthStats.averageGrowthRate.toFixed(2)}% / day
                  </div>
                </CardContent>
              </Card>
              {growthStats.projectedWeight && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Projected Weight
                    </div>
                    <div className="text-2xl font-bold">
                      {growthStats.projectedWeight.toFixed(1)}
                    </div>
                  </CardContent>
                </Card>
              )}
              {growthStats.weightGoal && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Weight Goal
                    </div>
                    <div className="text-2xl font-bold">
                      {growthStats.weightGoal.toFixed(1)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-2 px-4 font-medium">Date</th>
                  <th className="text-left py-2 px-4 font-medium">Weight</th>
                  <th className="text-left py-2 px-4 font-medium">Notes</th>
                  {onDeleteWeight && (
                    <th className="text-right py-2 px-4 font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {[...weightHistory]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => (
                    <tr key={record.id} className="border-b border-muted/30">
                      <td className="py-3 px-4">{formatDate(record.date)}</td>
                      <td className="py-3 px-4">
                        {record.weight} {record.weight_unit || record.unit}
                      </td>
                      <td className="py-3 px-4">{record.notes || '-'}</td>
                      {onDeleteWeight && (
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteWeight(record.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default WeightTrackingSection;
