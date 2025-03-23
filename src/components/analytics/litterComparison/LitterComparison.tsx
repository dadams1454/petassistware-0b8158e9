
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { useLitterComparisonData } from './hooks/useLitterComparisonData';
import { useChartData } from './hooks/useChartData';
import FilterControls from './components/FilterControls';
import DamSelector from './components/DamSelector';
import DamInfoCard from './components/DamInfoCard';
import ComparisonTabs from './components/ComparisonTabs';
import LoadingState from './components/LoadingState';

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filterBreed, setFilterBreed] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("counts");

  // Use our custom hook to fetch and manage data
  const {
    breeds,
    dams,
    litterDetails,
    selectedDamId,
    setSelectedDamId,
    isLoadingDams,
    isLoadingLitters
  } = useLitterComparisonData(dateRange, filterBreed);

  // Use chart data hook to process data for charts
  const {
    puppiesPerLitterData,
    weightComparisonData,
    colorDistributionData,
    COLORS
  } = useChartData(litterDetails);

  // Reset active tab when dam changes
  useEffect(() => {
    setActiveTab("counts");
  }, [selectedDamId]);

  // Get the selected dam details
  const selectedDam = useMemo(() => {
    if (!dams || !selectedDamId) return null;
    return dams.find(dam => dam.id === selectedDamId);
  }, [dams, selectedDamId]);

  // Combined loading state from parent and local queries
  const isLoadingAll = isLoading || isLoadingDams;
  const isContentLoading = isLoadingAll || (selectedDamId && isLoadingLitters);

  // Reset all filters
  const resetFilters = () => {
    setDateRange(undefined);
    setFilterBreed(undefined);
    setSelectedDamId(null);
  };

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
        {/* Filter Controls */}
        <FilterControls
          dateRange={dateRange}
          setDateRange={setDateRange}
          filterBreed={filterBreed}
          setFilterBreed={setFilterBreed}
          resetFilters={resetFilters}
          breeds={breeds}
        />
        
        {/* Dam Selector */}
        <DamSelector
          dams={dams}
          selectedDamId={selectedDamId}
          setSelectedDamId={setSelectedDamId}
          isLoading={isContentLoading}
        />

        {isContentLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Dam Info Card */}
            <DamInfoCard selectedDam={selectedDam} />

            {/* Comparison Tabs */}
            {selectedDamId && (
              <ComparisonTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                puppiesPerLitterData={puppiesPerLitterData}
                weightComparisonData={weightComparisonData}
                colorDistributionData={colorDistributionData}
                colors={COLORS}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LitterComparison;
