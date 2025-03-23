
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useDamLitters } from './hooks/useDamLitters';
import DamSelector from './components/DamSelector';
import DamInfoCard from './components/DamInfoCard';
import ComparisonTabs from './components/ComparisonTabs';

interface LitterComparisonProps {
  className?: string;
  litters?: any[]; // Passing the litters data from parent component
  isLoading?: boolean; // Loading state from parent
}

const LitterComparison: React.FC<LitterComparisonProps> = ({ 
  className, 
  litters = [], // Default to empty array for type safety
  isLoading = false 
}) => {
  const [selectedDamId, setSelectedDamId] = useState<string | null>(null);
  
  // Use the custom hook to fetch dam data
  const { 
    dams, 
    selectedDam, 
    litterDetails, 
    isLoadingDams, 
    isLoadingLitters 
  } = useDamLitters(selectedDamId);

  // Set the first dam as selected when data loads
  useEffect(() => {
    if (dams && dams.length > 0 && !selectedDamId) {
      setSelectedDamId(dams[0].id);
    }
  }, [dams]); // Simplified dependency array

  // Combined loading state from parent and local queries
  const isLoadingAll = isLoading || isLoadingDams;

  if (isLoadingAll) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading dam breeding data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dams || dams.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-amber-500 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>No female dogs with litters found in the database.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Breeding History Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Dam Selector Component */}
        <DamSelector 
          selectedDamId={selectedDamId} 
          setSelectedDamId={setSelectedDamId} 
          dams={dams} 
        />

        {/* Dam Info Card Component */}
        <DamInfoCard selectedDam={selectedDam} />

        {/* Comparison Tabs - only shown when a dam is selected */}
        {selectedDamId && (
          <ComparisonTabs
            litterDetails={litterDetails}
            isLoadingLitters={isLoadingLitters}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LitterComparison;
