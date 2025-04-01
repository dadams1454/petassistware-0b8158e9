
import React, { useState } from 'react';
import { PlusCircle, ChevronDown, Scale, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState, LoadingState } from '@/components/ui/standardized';
import { format } from 'date-fns';
import { useHealthTabContext } from './HealthTabContext';
import { WeightRecord } from '@/types/health';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const WeightTabContent: React.FC = () => {
  const {
    dogId,
    weightHistory,
    isLoading,
    growthStats,
    openAddWeightDialog,
  } = useHealthTabContext();
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  
  // Function to handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setSelectedWeight(id);
    setDeleteConfirmOpen(true);
  };
  
  // Function to confirm deletion
  const confirmDelete = () => {
    // Implementation would go here in the full version
    setDeleteConfirmOpen(false);
    setSelectedWeight(null);
  };
  
  if (isLoading) {
    return <LoadingState message="Loading weight records..." />;
  }
  
  if (weightHistory.length === 0) {
    return (
      <EmptyState
        title="No weight records"
        description="Track your dog's weight over time to monitor growth and health."
        action={{
          label: "Add Weight Record",
          onClick: openAddWeightDialog
        }}
      />
    );
  }
  
  // Sort weights by date (newest first)
  const sortedWeights = [...weightHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Weight History</h3>
          <p className="text-sm text-muted-foreground">
            Tracking {sortedWeights.length} weight records
          </p>
        </div>
        <Button 
          onClick={openAddWeightDialog}
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Weight
        </Button>
      </div>
      
      {growthStats.percentChange !== 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Latest Change</h4>
                <p className={`text-xl font-semibold ${
                  growthStats.percentChange > 0 
                    ? 'text-green-600' 
                    : growthStats.percentChange < 0 
                      ? 'text-red-600' 
                      : ''
                }`}>
                  {growthStats.percentChange > 0 && '+'}
                  {growthStats.percentChange.toFixed(1)}%
                </p>
              </div>
              
              {growthStats.averageGrowthRate !== 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Avg. Growth Rate</h4>
                  <p className="text-xl font-semibold">
                    {growthStats.averageGrowthRate.toFixed(2)}%/day
                  </p>
                </div>
              )}
              
              {growthStats.projectedWeight && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Projected Weight</h4>
                  <p className="text-xl font-semibold">
                    {growthStats.projectedWeight.toFixed(1)} {sortedWeights[0].unit}
                  </p>
                </div>
              )}
              
              {growthStats.weightGoal && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Weight Goal</h4>
                  <p className="text-xl font-semibold">
                    {growthStats.weightGoal.toFixed(1)} {sortedWeights[0].unit}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedWeights.map((record, index) => {
              const prevRecord = index < sortedWeights.length - 1 ? sortedWeights[index + 1] : null;
              const change = prevRecord 
                ? ((record.weight - prevRecord.weight) / prevRecord.weight) * 100 
                : 0;
              
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(record.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{record.weight}</span>
                      <span className="ml-1 text-gray-500">{record.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prevRecord ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        change > 0 
                          ? 'bg-green-100 text-green-800' 
                          : change < 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">Baseline</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openAddWeightDialog()}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(record.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this weight record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WeightTabContent;
